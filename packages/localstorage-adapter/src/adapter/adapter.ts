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

const STORAGE_SLICE = '@flopflip';

class LocalStorageAdapter implements TLocalStorageAdapterInterface {
  #__internalConfiguredStatusChange__ = '__internalConfiguredStatusChange__';
  #cache = createCache({ prefix: STORAGE_SLICE });
  #adapterState: TAdapterStatus & LocalStorageAdapterState;

  id: typeof interfaceIdentifiers.localstorage;

  constructor() {
    this.#adapterState = {
      ...intialAdapterState,
    };
    this.id = interfaceIdentifiers.localstorage;
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

  #subscribeToFlagsChanges = ({
    pollingInteral = 1000 * 60,
  }: TLocalStorageAdapterSubscriptionOptions) => {
    setInterval(() => {
      if (!this.#getIsAdapterUnsubscribed()) {
        const nextFlags = normalizeFlags(this.#cache.get('flags'));

        if (this.#didFlagsChange(nextFlags)) {
          this.#adapterState.flags = nextFlags;
          this.#adapterState.emitter.emit('flagsStateChange', nextFlags);
        }
      }
    }, pollingInteral);
  };

  updateFlags: TFlagsUpdateFunction = (flags, options) => {
    const isAdapterConfigured =
      this.#adapterState.configurationStatus ===
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

    this.#cache.set('flags', nextFlags);
    this.#adapterState.flags = nextFlags;

    this.#adapterState.emitter.emit('flagsStateChange', nextFlags);
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

    this.#adapterState.emitter.on<TFlagsChange>(
      'flagsStateChange',
      // @ts-expect-error
      handleFlagsChange
    );
    this.#adapterState.emitter.on<TAdapterStatusChange>(
      'statusStateChange',
      // @ts-expect-error
      handleStatusChange
    );

    this.#adapterState.configurationStatus =
      AdapterConfigurationStatus.Configuring;

    this.#adapterState.emitter.emit('statusStateChange', {
      configurationStatus: this.#adapterState.configurationStatus,
    });

    const { user, adapterConfiguration } = adapterArgs;

    this.#adapterState.user = user;

    return Promise.resolve().then(() => {
      this.#adapterState.configurationStatus =
        AdapterConfigurationStatus.Configured;

      const flags = normalizeFlags(this.#cache.get('flags'));

      this.#adapterState.flags = flags;
      this.#adapterState.emitter.emit('flagsStateChange', flags);
      this.#adapterState.emitter.emit('statusStateChange', {
        configurationStatus: this.#adapterState.configurationStatus,
      });
      this.#adapterState.emitter.emit(this.#__internalConfiguredStatusChange__);

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
    this.#adapterState.flags = {};

    const nextUser = adapterArgs.user;
    this.#adapterState.user = nextUser;

    this.#adapterState.emitter.emit('flagsStateChange', {});

    return Promise.resolve({
      initializationStatus: AdapterInitializationStatus.Succeeded,
    });
  }

  async waitUntilConfigured() {
    return new Promise<void>((resolve) => {
      if (
        this.#adapterState.configurationStatus ===
        AdapterConfigurationStatus.Configured
      )
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

  unsubscribe() {
    this.#adapterState.subscriptionStatus =
      AdapterSubscriptionStatus.Unsubscribed;
  }

  subscribe() {
    this.#adapterState.subscriptionStatus =
      AdapterSubscriptionStatus.Subscribed;
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
