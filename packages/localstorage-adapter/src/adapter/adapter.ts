import type {
  TUser,
  TAdapterStatus,
  TAdapterStatusChange,
  TAdapterEventHandlers,
  TLocalStorageAdapterArgs,
  TFlags,
  TFlagName,
  TLocalStorageAdapterSubscriptionOptions,
  TFlagsUpdateFunction,
  TFlagsChange,
  TLocalStorageAdapterInterface,
} from '@flopflip/types';
import {
  AdapterInitializationStatus,
  AdapterSubscriptionStatus,
  AdapterConfigurationStatus,
  interfaceIdentifiers,
} from '@flopflip/types';
import {
  normalizeFlags,
  normalizeFlag,
  exposeGlobally,
} from '@flopflip/adapter-utilities';

import warning from 'tiny-warning';
import mitt, { Emitter } from 'mitt';
import isEqual from 'lodash/isEqual';
import createCache from '@flopflip/localstorage-cache';

type LocalStorageAdapterState = {
  flags: TFlags;
  user?: TUser;
  emitter: Emitter;
  lockedFlags: Set<TFlagName>;
};

const intialAdapterState: TAdapterStatus & LocalStorageAdapterState = {
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
  flags: {},
  lockedFlags: new Set<TFlagName>(),
  user: {},
  // Typings are incorrect and state that mitt is not callable.
  // Value of type 'MittStatic' is not callable. Did you mean to include 'new'
  emitter: mitt(),
};

let adapterState: TAdapterStatus & LocalStorageAdapterState = {
  ...intialAdapterState,
};

const STORAGE_SLICE = '@flopflip';

class LocalStorageAdapter implements TLocalStorageAdapterInterface {
  #__internalConfiguredStatusChange__ = '__internalConfiguredStatusChange__';
  #cache = createCache({ prefix: STORAGE_SLICE });

  id: typeof interfaceIdentifiers.localstorage;

  constructor() {
    this.id = interfaceIdentifiers.localstorage;
  }

  #getIsAdapterUnsubscribed = () =>
    adapterState.subscriptionStatus === AdapterSubscriptionStatus.Unsubscribed;

  #getIsFlagLocked = (flagName: TFlagName) =>
    adapterState.lockedFlags.has(flagName);

  #didFlagsChange = (nextFlags: TFlags) => {
    const previousFlags = adapterState.flags;

    if (previousFlags === undefined) return true;

    return !isEqual(nextFlags, previousFlags);
  };

  #subscribeToFlagsChanges = ({
    pollingInteral = 1000 * 60,
  }: TLocalStorageAdapterSubscriptionOptions) => {
    setInterval(() => {
      if (!this.#getIsAdapterUnsubscribed()) {
        const nextFlags = normalizeFlags(this.#cache.get('flags'));

        if (this.#didFlagsChange(nextFlags)) {
          adapterState.flags = nextFlags;
          adapterState.emitter.emit('flagsStateChange', nextFlags);
        }
      }
    }, pollingInteral);
  };

  updateFlags: TFlagsUpdateFunction = (flags, options) => {
    const isAdapterConfigured =
      adapterState.configurationStatus ===
      AdapterConfigurationStatus.Configured;

    warning(
      isAdapterConfigured,
      '@flopflip/localstorage-adapter: adapter not configured. Flags can not be updated before.'
    );

    if (!isAdapterConfigured) return;

    const previousFlags: TFlags | null = this.#cache.get('flags') as TFlags;

    const updatedFlags = Object.entries(flags).reduce(
      (updatedFlags, [flagName, flagValue]) => {
        const [normalizedFlagName, normalizedFlagValue] = normalizeFlag(
          flagName,
          flagValue
        );

        if (this.#getIsFlagLocked(normalizedFlagName)) return updatedFlags;

        if (options?.lockFlags) {
          adapterState.lockedFlags.add(normalizedFlagName);
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

    this.#cache.set('flags', nextFlags);
    adapterState.flags = nextFlags;

    adapterState.emitter.emit('flagsStateChange', nextFlags);
  };

  async configure(
    adapterArgs: TLocalStorageAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) {
    const handleFlagsChange = (nextFlags: TFlags) => {
      if (this.#getIsAdapterUnsubscribed()) return;

      adapterEventHandlers.onFlagsStateChange(nextFlags);
    };

    const handleStatusChange = (nextStatus: TAdapterStatusChange) => {
      if (this.#getIsAdapterUnsubscribed()) return;

      adapterEventHandlers.onStatusStateChange(nextStatus);
    };

    adapterState.emitter.on<TFlagsChange>(
      'flagsStateChange',
      // @ts-expect-error
      handleFlagsChange
    );
    adapterState.emitter.on<TAdapterStatusChange>(
      'statusStateChange',
      // @ts-expect-error
      handleStatusChange
    );

    adapterState.configurationStatus = AdapterConfigurationStatus.Configuring;

    adapterState.emitter.emit('statusStateChange', {
      configurationStatus: adapterState.configurationStatus,
    });

    const { user, adapterConfiguration } = adapterArgs;

    adapterState.user = user;

    return Promise.resolve().then(() => {
      adapterState.configurationStatus = AdapterConfigurationStatus.Configured;

      const flags = normalizeFlags(this.#cache.get('flags'));

      adapterState.flags = flags;
      adapterState.emitter.emit('flagsStateChange', flags);
      adapterState.emitter.emit('statusStateChange', {
        configurationStatus: adapterState.configurationStatus,
      });
      adapterState.emitter.emit(this.#__internalConfiguredStatusChange__);

      this.#subscribeToFlagsChanges({
        pollingInteral: adapterConfiguration?.pollingInteral,
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
    this.#cache.unset('flags');
    adapterState.flags = {};

    const nextUser = adapterArgs.user;
    adapterState.user = nextUser;

    adapterState.emitter.emit('flagsStateChange', {});

    return Promise.resolve({
      initializationStatus: AdapterInitializationStatus.Succeeded,
    });
  }

  async waitUntilConfigured() {
    return new Promise<void>((resolve) => {
      if (
        adapterState.configurationStatus ===
        AdapterConfigurationStatus.Configured
      )
        resolve();
      else
        adapterState.emitter.on(
          this.#__internalConfiguredStatusChange__,
          resolve
        );
    });
  }

  getIsConfigurationStatus(configurationStatus: AdapterConfigurationStatus) {
    return adapterState.configurationStatus === configurationStatus;
  }

  unsubscribe() {
    adapterState.subscriptionStatus = AdapterSubscriptionStatus.Unsubscribed;
  }

  subscribe() {
    adapterState.subscriptionStatus = AdapterSubscriptionStatus.Subscribed;
  }

  // NOTE: This function is deprecated. Please use `getIsConfigurationStatus`.
  getIsReady() {
    warning(
      false,
      '@flopflip/localstorage-adapter: `getIsReady` has been deprecated. Please use `getIsConfigurationStatus` instead.'
    );

    return this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured);
  }
}

const adapter = new LocalStorageAdapter();

exposeGlobally(adapter, adapter.updateFlags);

const updateFlags = adapter.updateFlags;

export default adapter;
export { updateFlags, STORAGE_SLICE };
