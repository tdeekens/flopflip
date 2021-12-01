import {
  exposeGlobally,
  normalizeFlag,
  normalizeFlags,
} from '@flopflip/adapter-utilities';
import createCache from '@flopflip/localstorage-cache';
import {
  type TAdapterEventHandlers,
  type TAdapterStatus,
  type TAdapterStatusChange,
  type TFlagName,
  type TFlags,
  type TFlagsChange,
  type TLocalStorageAdapterArgs,
  type TLocalStorageAdapterInterface,
  type TUpdateFlagsOptions,
  type TUser,
  AdapterConfigurationStatus,
  adapterIdentifiers,
  AdapterInitializationStatus,
  AdapterSubscriptionStatus,
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

type TLocalStorageAdapterState = {
  flags: TFlags;
  user?: TUser;
  emitter: Emitter<TEmitterEvents>;
  lockedFlags: Set<TFlagName>;
};

const intialAdapterState: TAdapterStatus & TLocalStorageAdapterState = {
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
  flags: {},
  lockedFlags: new Set<TFlagName>(),
  user: {},
  emitter: mitt(),
};

const STORAGE_SLICE = '@flopflip';

class LocalStorageAdapter implements TLocalStorageAdapterInterface {
  #__internalConfiguredStatusChange__: TInternalStatusChange =
    '__internalConfiguredStatusChange__';

  #cache = createCache({ prefix: STORAGE_SLICE });
  #adapterState: TAdapterStatus & TLocalStorageAdapterState;

  id: typeof adapterIdentifiers.localstorage;

  constructor() {
    this.#adapterState = {
      ...intialAdapterState,
    };
    this.id = adapterIdentifiers.localstorage;
  }

  #getIsAdapterUnsubscribed = () =>
    this.#adapterState.subscriptionStatus ===
    AdapterSubscriptionStatus.Unsubscribed;

  #getIsFlagLocked = (flagName: TFlagName) =>
    this.#adapterState.lockedFlags.has(flagName);

  #didFlagsChange = (nextFlags: TFlags) => {
    const previousFlags = this.#adapterState.flags;

    if (previousFlags === undefined) return true;

    return !isEqual(nextFlags, previousFlags);
  };

  #getFlagsCacheKey = (user: TUser) =>
    [user.key, 'flags'].filter(Boolean).join('/');

  #subscribeToFlagsChanges = ({
    pollingInteralMs = 1000 * 60,
    user,
  }: {
    pollingInteralMs?: TLocalStorageAdapterArgs['pollingInteralMs'];
    user: TUser;
  }) => {
    setInterval(() => {
      if (!this.#getIsAdapterUnsubscribed()) {
        const nextFlags = normalizeFlags(
          this.#cache.get<TFlags>(this.#getFlagsCacheKey(user))
        );

        if (this.#didFlagsChange(nextFlags)) {
          this.#adapterState.flags = nextFlags;
          this.#adapterState.emitter.emit('flagsStateChange', nextFlags);
        }
      }
    }, pollingInteralMs);
  };

  updateFlags = (flags: TFlags, options?: TUpdateFlagsOptions) => {
    const isAdapterConfigured = this.getIsConfigurationStatus(
      AdapterConfigurationStatus.Configured
    );

    warning(
      isAdapterConfigured,
      '@flopflip/localstorage-adapter: adapter not configured. Flags can not be updated before.'
    );

    if (!isAdapterConfigured) return;

    const flagsCacheKey = this.#getFlagsCacheKey(this.#adapterState.user!);
    const previousFlags: TFlags | null = this.#cache.get<TFlags>(flagsCacheKey);

    const updatedFlags = Object.entries(flags).reduce<TFlags>(
      (updatedFlags: TFlags, [flagName, flagValue]) => {
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

    this.#cache.set(flagsCacheKey, nextFlags);
    this.#adapterState.flags = nextFlags;

    this.#adapterState.emitter.emit('flagsStateChange', nextFlags);
  };

  async configure(
    adapterArgs: TLocalStorageAdapterArgs,
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

    const { user, pollingInteralMs } = adapterArgs;

    this.#adapterState.user = user;

    return Promise.resolve().then(() => {
      this.setConfigurationStatus(AdapterConfigurationStatus.Configured);

      const flags = normalizeFlags(
        this.#cache.get(this.#getFlagsCacheKey(user))
      );

      this.#adapterState.flags = flags;
      this.#adapterState.emitter.emit('flagsStateChange', flags);
      this.#adapterState.emitter.emit(this.#__internalConfiguredStatusChange__);

      this.#subscribeToFlagsChanges({
        pollingInteralMs,
        user,
      });

      return {
        initializationStatus: AdapterInitializationStatus.Succeeded,
      };
    });
  }

  async reconfigure(
    adapterArgs: TLocalStorageAdapterArgs,
    _adapterEventHandlers: TAdapterEventHandlers
  ) {
    const previousFlags = this.#cache.get<TFlags>(
      this.#getFlagsCacheKey(adapterArgs.user)
    );
    this.#adapterState.flags = previousFlags || {};

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

const adapter = new LocalStorageAdapter();

exposeGlobally(adapter);

export default adapter;
export { STORAGE_SLICE };
