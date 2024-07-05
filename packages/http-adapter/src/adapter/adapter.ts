import {
  exposeGlobally,
  normalizeFlag,
  normalizeFlags,
} from '@flopflip/adapter-utilities';
import { getCache } from '@flopflip/cache';
import {
  AdapterConfigurationStatus,
  AdapterInitializationStatus,
  AdapterSubscriptionStatus,
  type TAdapterEventHandlers,
  type TAdapterStatus,
  type TAdapterStatusChange,
  type TCacheIdentifiers,
  type TFlagName,
  type TFlagVariation,
  type TFlags,
  type TFlagsChange,
  type TFlagsUpdateFunction,
  type THttpAdapterArgs,
  type THttpAdapterInterface,
  type TUser,
  adapterIdentifiers,
  cacheModes,
} from '@flopflip/types';
import isEqual from 'lodash/isEqual';
import mitt, { type Emitter } from 'mitt';
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

const intialAdapterState: TAdapterStatus & THttpAdapterState = {
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
  flags: {},
  lockedFlags: new Set<TFlagName>(),
  user: {},
  emitter: mitt(),
};

class HttpAdapter implements THttpAdapterInterface {
  id: typeof adapterIdentifiers.http;
  #__internalConfiguredStatusChange__: TInternalStatusChange =
    '__internalConfiguredStatusChange__';

  #flagPollingInternal?: ReturnType<typeof setInterval>;
  #adapterState: TAdapterStatus & THttpAdapterState;
  readonly #defaultpollingIntervalMs = 1000 * 60;

  constructor() {
    this.id = adapterIdentifiers.http;
    this.#adapterState = {
      ...intialAdapterState,
    };
  }

  readonly #getIsAdapterUnsubscribed = () =>
    this.#adapterState.subscriptionStatus ===
    AdapterSubscriptionStatus.Unsubscribed;

  readonly #getIsFlagLocked = (flagName: TFlagName) =>
    this.#adapterState.lockedFlags.has(flagName);

  readonly #didFlagsChange = (nextFlags: TFlags) => {
    const previousFlags = this.#adapterState.flags;

    if (previousFlags === undefined) {
      return true;
    }

    return !isEqual(nextFlags, previousFlags);
  };

  readonly #fetchFlags = async (
    adapterArgs: THttpAdapterArgs
  ): Promise<TFlags> => {
    const flags = await adapterArgs.execute(adapterArgs);

    return flags;
  };

  readonly #subscribeToFlagsChanges = (adapterArgs: THttpAdapterArgs) => {
    const pollingIntervalMs =
      adapterArgs.pollingIntervalMs ?? this.#defaultpollingIntervalMs;

    if (this.#flagPollingInternal) {
      clearInterval(this.#flagPollingInternal);
    }

    this.#flagPollingInternal = setInterval(async () => {
      if (!this.#getIsAdapterUnsubscribed()) {
        const nextFlags = normalizeFlags(await this.#fetchFlags(adapterArgs));

        if (this.#didFlagsChange(nextFlags)) {
          if (adapterArgs.cacheIdentifier) {
            const cache = await getCache(
              adapterArgs.cacheIdentifier,
              adapterIdentifiers.http,
              { key: this.#adapterState.user?.key }
            );

            cache.set(nextFlags);
          }

          this.#adapterState.flags = nextFlags;

          if (adapterArgs.cacheMode === cacheModes.lazy) {
            return;
          }

          this.#adapterState.emitter.emit('flagsStateChange', nextFlags);
        }
      }
    }, pollingIntervalMs);
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

    if (!isAdapterConfigured) {
      return;
    }

    const previousFlags: TFlags | undefined = this.#adapterState.flags;

    const updatedFlags = Object.entries(flags).reduce(
      (updatedFlags, [flagName, flagValue]) => {
        const [normalizedFlagName, normalizedFlagValue] = normalizeFlag(
          flagName,
          flagValue
        );

        if (this.#getIsFlagLocked(normalizedFlagName)) {
          return updatedFlags;
        }

        if (options?.lockFlags) {
          this.#adapterState.lockedFlags.add(normalizedFlagName);
        }

        const updated = {
          ...updatedFlags,
          [normalizedFlagName]: normalizedFlagValue,
        };

        return updated;
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
      if (this.#getIsAdapterUnsubscribed()) {
        return;
      }

      adapterEventHandlers.onFlagsStateChange({
        flags: nextFlags,
        id: this.id,
      });
    };

    const handleStatusChange = (nextStatus: TAdapterStatusChange['status']) => {
      if (this.#getIsAdapterUnsubscribed()) {
        return;
      }

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
      let cachedFlags = null;

      if (adapterArgs.cacheIdentifier) {
        const cache = await getCache(
          adapterArgs.cacheIdentifier,
          adapterIdentifiers.http,
          { key: this.#adapterState.user?.key }
        );

        cachedFlags = cache.get();

        if (cachedFlags) {
          this.#adapterState.flags = cachedFlags;
          this.#adapterState.emitter.emit(
            'flagsStateChange',
            cachedFlags as TFlags
          );
        }
      }

      const flags = normalizeFlags(await this.#fetchFlags(adapterArgs));

      this.#adapterState.flags = flags;

      this.setConfigurationStatus(AdapterConfigurationStatus.Configured);

      if (adapterArgs.cacheIdentifier) {
        const cache = await getCache(
          adapterArgs.cacheIdentifier,
          adapterIdentifiers.http,
          { key: this.#adapterState.user?.key }
        );

        cache.set(flags);
      }

      if (adapterArgs.cacheMode !== cacheModes.lazy) {
        this.#adapterState.emitter.emit('flagsStateChange', flags);
      }

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
    if (!this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)) {
      return Promise.reject(
        new Error(
          '@flopflip/http-adapter: please configure adapter before reconfiguring.'
        )
      );
    }

    const nextUser = adapterArgs.user;

    if (!isEqual(this.#adapterState.user, nextUser)) {
      this.#adapterState.flags = {};

      if (adapterArgs.cacheIdentifier) {
        const cache = await getCache(
          adapterArgs.cacheIdentifier,
          adapterIdentifiers.http,
          { key: this.#adapterState.user?.key }
        );

        cache.unset();
      }

      this.#adapterState.user = nextUser;

      const flags = normalizeFlags(await this.#fetchFlags(adapterArgs));

      this.#adapterState.flags = flags;

      this.#adapterState.emitter.emit('flagsStateChange', flags);

      this.#adapterState.emitter.emit(this.#__internalConfiguredStatusChange__);

      this.#subscribeToFlagsChanges(adapterArgs);
    }

    return Promise.resolve({
      initializationStatus: AdapterInitializationStatus.Succeeded,
    });
  }

  async waitUntilConfigured() {
    return new Promise<void>((resolve) => {
      if (
        this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
      ) {
        resolve();
      } else {
        this.#adapterState.emitter.on(
          this.#__internalConfiguredStatusChange__,
          resolve
        );
      }
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
