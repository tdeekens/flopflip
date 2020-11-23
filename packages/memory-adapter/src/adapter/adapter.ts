import type { DeepReadonly } from 'ts-essentials';
import type {
  TUser,
  TAdapterStatus,
  TAdapterStatusChange,
  TFlagName,
  TFlagVariation,
  TFlag,
  TFlags,
  TAdapterEventHandlers,
  TMemoryAdapterArgs,
  TFlagsUpdateFunction,
  TFlagsChange,
  TMemoryAdapterInterface,
  TAdapterInitializationStatus,
} from '@flopflip/types';
import {
  AdapterSubscriptionStatus,
  AdapterConfigurationStatus,
  interfaceIdentifiers,
} from '@flopflip/types';

import warning from 'tiny-warning';
import mitt, { Emitter } from 'mitt';
import camelCase from 'lodash/camelCase';
import getGlobalThis from 'globalthis';

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

let adapterState: TAdapterStatus & MemoryAdapterState = {
  ...intialAdapterState,
};
const updateUser = (user: Readonly<TUser>) => {
  adapterState.user = user;
};

const getIsAdapterUnsubscribed = () =>
  adapterState.subscriptionStatus === AdapterSubscriptionStatus.Unsubscribed;
const getIsFlagLocked = (flagName: TFlagName) =>
  adapterState.lockedFlags.has(flagName);

const normalizeFlag = (
  flagName: TFlagName,
  flagValue?: TFlagVariation
): TFlag => [
  camelCase(flagName),
  // Multi variate flags contain a string or `null` - `false` seems more natural.
  flagValue === null || flagValue === undefined ? false : flagValue,
];

const getUser = () => adapterState.user;

const updateFlags: TFlagsUpdateFunction = (flags, options) => {
  const isAdapterConfigured =
    adapterState.configurationStatus === AdapterConfigurationStatus.Configured;

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

    if (getIsFlagLocked(normalizedFlagName)) return;

    if (options?.lockFlags) {
      adapterState.lockedFlags.add(normalizedFlagName);
    }

    adapterState.flags = {
      ...adapterState.flags,
      [normalizedFlagName]: normalizedFlagValue,
    };
  });

  adapterState.emitter.emit('flagsStateChange', adapterState.flags);
};

const __internalConfiguredStatusChange__ = '__internalConfiguredStatusChange__';

class MemoryAdapter implements TMemoryAdapterInterface {
  id: typeof interfaceIdentifiers.memory;

  constructor() {
    this.id = interfaceIdentifiers.memory;
  }

  async configure(
    adapterArgs: DeepReadonly<TMemoryAdapterArgs>,
    adapterEventHandlers: Readonly<TAdapterEventHandlers>
  ) {
    const handleFlagsChange = (nextFlags: Readonly<TFlags>) => {
      if (getIsAdapterUnsubscribed()) return;

      adapterEventHandlers.onFlagsStateChange(nextFlags);
    };

    const handleStatusChange = (nextStatus: Readonly<TAdapterStatusChange>) => {
      if (getIsAdapterUnsubscribed()) return;

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

    const { user } = adapterArgs;

    adapterState.user = user;

    return Promise.resolve().then(() => {
      adapterState.flags = {};

      updateUser(user);

      adapterState.configurationStatus = AdapterConfigurationStatus.Configured;

      adapterState.emitter.emit('flagsStateChange', adapterState.flags);
      adapterState.emitter.emit('statusStateChange', {
        configurationStatus: adapterState.configurationStatus,
      });

      adapterState.emitter.emit(__internalConfiguredStatusChange__);

      return {
        initializationStatus: TAdapterInitializationStatus.Succeeded,
      };
    });
  }

  async reconfigure(
    adapterArgs: DeepReadonly<TMemoryAdapterArgs>,
    _adapterEventHandlers: Readonly<TAdapterEventHandlers>
  ) {
    adapterState.configurationStatus = AdapterConfigurationStatus.Configuring;

    updateUser(adapterArgs.user);

    adapterState.flags = {};

    adapterState.configurationStatus = AdapterConfigurationStatus.Configured;

    adapterState.emitter.emit('flagsStateChange', adapterState.flags);
    adapterState.emitter.emit('statusStateChange', {
      configurationStatus: adapterState.configurationStatus,
    });

    return Promise.resolve({
      initializationStatus: TAdapterInitializationStatus.Succeeded,
    });
  }

  getIsConfigurationStatus(configurationStatus: AdapterConfigurationStatus) {
    return adapterState.configurationStatus === configurationStatus;
  }

  setConfigurationStatus(nextConfigurationStatus: AdapterConfigurationStatus) {
    adapterState.configurationStatus = nextConfigurationStatus;

    adapterState.emitter.emit('statusStateChange', {
      configurationStatus: adapterState.configurationStatus,
    });
  }

  reset = () => {
    adapterState = {
      ...intialAdapterState,
    };
  };

  async waitUntilConfigured() {
    return new Promise<void>((resolve) => {
      if (
        adapterState.configurationStatus ===
        AdapterConfigurationStatus.Configured
      )
        resolve();
      else adapterState.emitter.on(__internalConfiguredStatusChange__, resolve);
    });
  }

  getFlag(flagName: TFlagName) {
    return adapterState?.flags[flagName];
  }

  // For convenience
  updateFlags(flags: Readonly<TFlags>) {
    return updateFlags(flags);
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
      '@flopflip/memory-adapter: `getIsReady` has been deprecated. Please use `getIsConfigurationStatus` instead.'
    );

    return this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured);
  }
}

const adapter = new MemoryAdapter();

const exposeGlobally = () => {
  const globalThis = getGlobalThis();

  if (!globalThis.__flopflip__) {
    globalThis.__flopflip__ = {};
  }

  globalThis.__flopflip__.memory = {
    adapter,
    updateFlags,
  };
};

exposeGlobally();

export default adapter;
export { updateFlags, getUser, normalizeFlag };
