import type {
  TUser,
  TAdapterStatus,
  TAdapterStatusChange,
  TFlagName,
  TFlagVariation,
  TFlags,
  TUpdateFlagsOptions,
  TAdapterEventHandlers,
  TMemoryAdapterArgs,
  TFlagsChange,
  TMemoryAdapterInterface,
} from '@flopflip/types';
import {
  AdapterInitializationStatus,
  AdapterSubscriptionStatus,
  AdapterConfigurationStatus,
  interfaceIdentifiers,
} from '@flopflip/types';
import { normalizeFlag, exposeGlobally } from '@flopflip/adapter-utilities';

import warning from 'tiny-warning';
import mitt, { Emitter } from 'mitt';

type MemoryAdapterState = {
  flags: TFlags;
  lockedFlags: Set<TFlagName>;
  user?: TUser;
  emitter: Emitter;
};

const intialAdapterState: TAdapterStatus & MemoryAdapterState = {
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  flags: {},
  lockedFlags: new Set<TFlagName>(),
  user: {},
  // Typings are incorrect and state that mitt is not callable.
  // Value of type 'MittStatic' is not callable. Did you mean to include 'new'
  emitter: mitt(),
};

class MemoryAdapter implements TMemoryAdapterInterface {
  #__internalConfiguredStatusChange__ = '__internalConfiguredStatusChange__';
  #adapterState: TAdapterStatus & MemoryAdapterState;

  id: typeof interfaceIdentifiers.memory;

  constructor() {
    this.#adapterState = {
      ...intialAdapterState,
    };
    this.id = interfaceIdentifiers.memory;
  }

  #getIsAdapterUnsubscribed = () =>
    this.#adapterState.subscriptionStatus ===
    AdapterSubscriptionStatus.Unsubscribed;

  #getIsFlagLocked = (flagName: TFlagName) =>
    this.#adapterState.lockedFlags.has(flagName);

  #updateUser = (user: TUser) => {
    this.#adapterState.user = user;
  };

  getUser = () => this.#adapterState.user;

  updateFlags = (flags: TFlags, options?: TUpdateFlagsOptions) => {
    const isAdapterConfigured =
      this.#adapterState.configurationStatus ===
      AdapterConfigurationStatus.Configured;

    warning(
      isAdapterConfigured,
      '@flopflip/memory-adapter: adapter is not configured. Flags can not be updated before.'
    );

    if (!isAdapterConfigured) return;

    Object.entries(flags).forEach(([flagName, flagValue]) => {
      const [normalizedFlagName, normalizedFlagValue] = normalizeFlag(
        flagName,
        flagValue
      );

      if (this.#getIsFlagLocked(normalizedFlagName)) return;

      if (options?.lockFlags) {
        this.#adapterState.lockedFlags.add(normalizedFlagName);
      }

      this.#adapterState.flags = {
        ...this.#adapterState.flags,
        [normalizedFlagName]: normalizedFlagValue,
      };
    });

    this.#adapterState.emitter.emit(
      'flagsStateChange',
      this.#adapterState.flags
    );
  };

  async configure(
    adapterArgs: TMemoryAdapterArgs,
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

    const { user } = adapterArgs;

    this.#adapterState.user = user;

    return Promise.resolve().then(() => {
      this.#adapterState.flags = {};

      this.#updateUser(user);

      this.#adapterState.configurationStatus =
        AdapterConfigurationStatus.Configured;

      this.#adapterState.emitter.emit(
        'flagsStateChange',
        this.#adapterState.flags
      );
      this.#adapterState.emitter.emit('statusStateChange', {
        configurationStatus: this.#adapterState.configurationStatus,
      });

      this.#adapterState.emitter.emit(this.#__internalConfiguredStatusChange__);

      return {
        initializationStatus: AdapterInitializationStatus.Succeeded,
      };
    });
  }

  async reconfigure(
    adapterArgs: TMemoryAdapterArgs,
    _adapterEventHandlers: TAdapterEventHandlers
  ) {
    this.#adapterState.configurationStatus =
      AdapterConfigurationStatus.Configuring;

    this.#updateUser(adapterArgs.user);

    this.#adapterState.flags = {};

    this.#adapterState.configurationStatus =
      AdapterConfigurationStatus.Configured;

    this.#adapterState.emitter.emit(
      'flagsStateChange',
      this.#adapterState.flags
    );
    this.#adapterState.emitter.emit('statusStateChange', {
      configurationStatus: this.#adapterState.configurationStatus,
    });

    return Promise.resolve({
      initializationStatus: AdapterInitializationStatus.Succeeded,
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

  reset = () => {
    this.#adapterState = {
      ...intialAdapterState,
    };
  };

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

  getFlag(flagName: TFlagName): TFlagVariation {
    return this.#adapterState?.flags[flagName];
  }

  unsubscribe = () => {
    this.#adapterState.subscriptionStatus =
      AdapterSubscriptionStatus.Unsubscribed;
  };

  subscribe = () => {
    this.#adapterState.subscriptionStatus =
      AdapterSubscriptionStatus.Subscribed;
  };

  // NOTE: This function is deprecated. Please use `getIsConfigurationStatus`.
  getIsReady() {
    warning(
      false,
      '@flopflip/memory-adapter: `getIsReady` has been deprecated. Please use `getIsConfigurationStatus` instead.'
    );

    return this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured);
  }
}

const adapter = new MemoryAdapter();

exposeGlobally(adapter);

export default adapter;
