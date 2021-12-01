import {
  exposeGlobally,
  normalizeFlag,
  normalizeFlags,
} from '@flopflip/adapter-utilities';
import {
  type TAdapterEventHandlers,
  type TAdapterStatus,
  type TAdapterStatusChange,
  type TCacheIdentifiers,
  type TFlagName,
  type TFlags,
  type TFlagsChange,
  type TFlagsUpdateFunction,
  type TFlagVariation,
  type THttpAdapterArgs,
  type THttpAdapterInterface,
  type TUser,
  AdapterConfigurationStatus,
  adapterIdentifiers,
  AdapterInitializationStatus,
  AdapterSubscriptionStatus,
  cacheIdentifiers,
} from '@flopflip/types';
import isEqual from 'lodash/isEqual';
import mitt, { Emitter } from 'mitt';
import warning from 'tiny-warning';

type TInternalStatusChange = '__internalConfiguredStatusChange__';
type TEmitterEvents = {
  __internalConfiguredStatusChange__: undefined;
  flagsStateChange: TFlags;
  statusStateChange: Partial<TAdapterStatus>;
};
type THttpAdapterState = {
  flags: TFlags;
  user?: TUser;
  emitter: Emitter<TEmitterEvents>;
  lockedFlags: Set<TFlagName>;
  cacheIdentifier?: TCacheIdentifiers;
};

const STORAGE_SLICE = '@flopflip';

const intialAdapterState: TAdapterStatus & THttpAdapterState = {
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
  flags: {},
  lockedFlags: new Set<TFlagName>(),
  user: {},
  emitter: mitt(),
};

class HttpAdapter implements THttpAdapterInterface {
  #__internalConfiguredStatusChange__: TInternalStatusChange =
    '__internalConfiguredStatusChange__';

  #adapterState: TAdapterStatus & THttpAdapterState;
  #defaultPollingInteralMs = 1000 * 60;

  id: typeof adapterIdentifiers.http;

  constructor() {
    this.id = adapterIdentifiers.http;
    this.#adapterState = {
      ...intialAdapterState,
    };
  }

  #getIsAdapterUnsubscribed = () =>
    this.#adapterState.subscriptionStatus ===
    AdapterSubscriptionStatus.Unsubscribed;

  #getIsFlagLocked = (flagName: TFlagName) =>
    this.#adapterState.lockedFlags.has(flagName);

  #getCache = async (cacheIdentifier: TCacheIdentifiers) => {
    let cacheModule;

    switch (cacheIdentifier) {
      case cacheIdentifiers.local: {
        cacheModule = await import('@flopflip/localstorage-cache');
        break;
      }

      case cacheIdentifiers.session: {
        cacheModule = await import('@flopflip/sessionstorage-cache');
        break;
      }

      default:
        break;
    }

    const createCache = cacheModule.default;

    const cache = createCache({ prefix: STORAGE_SLICE });

    return {
      set(flags: TFlags) {
        return cache.set('flags', flags);
      },
      get() {
        return cache.get('flags');
      },
      unset() {
        return cache.unset('flags');
      },
    };
  };

  #didFlagsChange = (nextFlags: TFlags) => {
    const previousFlags = this.#adapterState.flags;

    if (previousFlags === undefined) return true;

    return !isEqual(nextFlags, previousFlags);
  };

  #fetchFlags = async (adapterArgs: THttpAdapterArgs): Promise<TFlags> => {
    const flags = await adapterArgs.execute();

    return flags;
  };

  #subscribeToFlagsChanges = (adapterArgs: THttpAdapterArgs) => {
    const pollingInteralMs =
      adapterArgs.pollingInteralMs ?? this.#defaultPollingInteralMs;

    setInterval(async () => {
      if (!this.#getIsAdapterUnsubscribed()) {
        const nextFlags = normalizeFlags(await this.#fetchFlags(adapterArgs));

        if (this.#didFlagsChange(nextFlags)) {
          if (adapterArgs.cacheIdentifier) {
            const cache = await this.#getCache(adapterArgs.cacheIdentifier);

            cache.set(nextFlags);
          }

          this.#adapterState.flags = nextFlags;
          this.#adapterState.emitter.emit('flagsStateChange', nextFlags);
        }
      }
    }, pollingInteralMs);
  };

  getUser = () => this.#adapterState.user;

  updateFlags: TFlagsUpdateFunction = (flags, options) => {
    const isAdapterConfigured = this.getIsConfigurationStatus(
      AdapterConfigurationStatus.Configured
    );

    warning(
      isAdapterConfigured,
      '@flopflip/http-adapter: adapter not configured. Flags can not be updated before.'
    );

    if (!isAdapterConfigured) return;

    const previousFlags: TFlags | null = this.#adapterState.flags;

    const updatedFlags = Object.entries(flags).reduce(
      (updatedFlags, [flagName, flagValue]) => {
        const [normalizedFlagName, normalizedFlagValue] = normalizeFlag(
          flagName,
          flagValue
        );

        if (this.#getIsFlagLocked(normalizedFlagName)) return updatedFlags;

        if (options?.lockFlags) {
          this.#adapterState.lockedFlags.add(normalizedFlagName);
        }

        updatedFlags = {
          ...updatedFlags,
          [normalizedFlagName]: normalizedFlagValue,
        };

        return updatedFlags;
      },
      {}
    );

    const nextFlags: TFlags = {
      ...previousFlags,
      ...updatedFlags,
    };

    this.#adapterState.flags = nextFlags;
    this.#adapterState.emitter.emit('flagsStateChange', nextFlags);
  };

  async configure(
    adapterArgs: THttpAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) {
    const handleFlagsChange = (nextFlags: TFlagsChange['flags']) => {
      if (this.#getIsAdapterUnsubscribed()) return;

      adapterEventHandlers.onFlagsStateChange({
        flags: nextFlags,
        id: this.id,
      });
    };

    const handleStatusChange = (nextStatus: TAdapterStatusChange['status']) => {
      if (this.#getIsAdapterUnsubscribed()) return;

      adapterEventHandlers.onStatusStateChange({
        status: nextStatus,
        id: this.id,
      });
    };

    this.#adapterState.emitter.on('flagsStateChange', handleFlagsChange);
    this.#adapterState.emitter.on('statusStateChange', handleStatusChange);

    this.setConfigurationStatus(AdapterConfigurationStatus.Configuring);

    this.#adapterState.user = adapterArgs.user;

    return Promise.resolve().then(async () => {
      let cachedFlags;

      if (adapterArgs.cacheIdentifier) {
        const cache = await this.#getCache(adapterArgs.cacheIdentifier);

        cachedFlags = cache.get();

        if (cachedFlags) {
          this.#adapterState.flags = cachedFlags;
          this.#adapterState.emitter.emit('flagsStateChange', cachedFlags);
        }
      }

      this.setConfigurationStatus(AdapterConfigurationStatus.Configured);

      const flags = normalizeFlags(await this.#fetchFlags(adapterArgs));

      this.#adapterState.flags = flags;

      if (adapterArgs.cacheIdentifier) {
        const cache = await this.#getCache(adapterArgs.cacheIdentifier);

        cache.set(flags);
      }

      this.#adapterState.emitter.emit('flagsStateChange', flags);
      this.#adapterState.emitter.emit(this.#__internalConfiguredStatusChange__);

      this.#subscribeToFlagsChanges(adapterArgs);

      return {
        initializationStatus: AdapterInitializationStatus.Succeeded,
      };
    });
  }

  async reconfigure(
    adapterArgs: THttpAdapterArgs,
    _adapterEventHandlers: TAdapterEventHandlers
  ) {
    if (!this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured))
      return Promise.reject(
        new Error(
          '@flopflip/http-adapter: please configure adapter before reconfiguring.'
        )
      );

    this.#adapterState.flags = {};

    if (adapterArgs.cacheIdentifier) {
      const cache = await this.#getCache(adapterArgs.cacheIdentifier);

      cache.unset();
    }

    const nextUser = adapterArgs.user;

    this.#adapterState.user = nextUser;
    this.#adapterState.emitter.emit('flagsStateChange', {});

    return Promise.resolve({
      initializationStatus: AdapterInitializationStatus.Succeeded,
    });
  }

  async waitUntilConfigured() {
    return new Promise<void>((resolve) => {
      if (this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured))
        resolve();
      else
        this.#adapterState.emitter.on(
          this.#__internalConfiguredStatusChange__,
          resolve
        );
    });
  }

  getIsConfigurationStatus(configurationStatus: AdapterConfigurationStatus) {
    return this.#adapterState.configurationStatus === configurationStatus;
  }

  getFlag(flagName: TFlagName): TFlagVariation {
    return this.#adapterState?.flags[flagName];
  }

  reset = () => {
    this.#adapterState = {
      ...intialAdapterState,
    };
  };

  setConfigurationStatus(nextConfigurationStatus: AdapterConfigurationStatus) {
    this.#adapterState.configurationStatus = nextConfigurationStatus;

    this.#adapterState.emitter.emit('statusStateChange', {
      configurationStatus: this.#adapterState.configurationStatus,
    });
  }

  unsubscribe = () => {
    this.#adapterState.subscriptionStatus =
      AdapterSubscriptionStatus.Unsubscribed;
  };

  subscribe = () => {
    this.#adapterState.subscriptionStatus =
      AdapterSubscriptionStatus.Subscribed;
  };
}

const adapter = new HttpAdapter();

exposeGlobally(adapter);

export default adapter;
