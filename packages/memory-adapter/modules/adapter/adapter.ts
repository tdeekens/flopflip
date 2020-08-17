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
} from '@flopflip/types';
import {
  TMemoryAdapterInterface,
  TAdapterSubscriptionStatus,
  TAdapterConfigurationStatus,
  TAdapterInitializationStatus,
  interfaceIdentifiers,
} from '@flopflip/types';

import warning from 'tiny-warning';
import mitt, { Emitter } from 'mitt';
import camelCase from 'lodash/camelCase';

type MemoryAdapterState = {
  flags: TFlags;
  user?: TUser;
  emitter: Emitter;
};

const intialAdapterState: TAdapterStatus & MemoryAdapterState = {
  configurationStatus: TAdapterConfigurationStatus.Unconfigured,
  subscriptionStatus: TAdapterSubscriptionStatus.Subscribed,
  flags: {},
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

const getIsUnsubscribed = () =>
  adapterState.subscriptionStatus === TAdapterSubscriptionStatus.Unsubscribed;

const normalizeFlag = (
  flagName: TFlagName,
  flagValue?: TFlagVariation
): TFlag => [
  camelCase(flagName),
  // Multi variate flags contain a string or `null` - `false` seems more natural.
  flagValue === null || flagValue === undefined ? false : flagValue,
];
const normalizeFlags = (rawFlags: Readonly<TFlags>) =>
  Object.entries(rawFlags).reduce<TFlags>(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (normalizedFlags: TFlags, [flagName, flagValue]) => {
      const [normalizedFlagName, normalizedFlagValue]: TFlag = normalizeFlag(
        flagName,
        flagValue
      );
      // Can't return expression as it is the assigned value
      normalizedFlags[normalizedFlagName] = normalizedFlagValue;

      return normalizedFlags;
    },
    {}
  );

const getUser = () => adapterState.user;

const updateFlags = (flags: Readonly<TFlags>) => {
  const isAdapterConfigured =
    adapterState.configurationStatus === TAdapterConfigurationStatus.Configured;

  warning(
    isAdapterConfigured,
    '@flopflip/memory-adapter: adapter is not configured. Flags can not be updated before.'
  );

  if (!isAdapterConfigured) return;

  adapterState.flags = {
    ...adapterState.flags,
    ...normalizeFlags(flags),
  };

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
      if (getIsUnsubscribed()) return;

      adapterEventHandlers.onFlagsStateChange(nextFlags);
    };

    const handleStatusChange = (nextStatus: Readonly<TAdapterStatusChange>) => {
      if (getIsUnsubscribed()) return;

      adapterEventHandlers.onStatusStateChange(nextStatus);
    };

    adapterState.emitter.on('flagsStateChange', handleFlagsChange);
    adapterState.emitter.on('statusStateChange', handleStatusChange);

    adapterState.configurationStatus = TAdapterConfigurationStatus.Configuring;

    adapterState.emitter.emit('statusStateChange', {
      configurationStatus: adapterState.configurationStatus,
    });

    const { user } = adapterArgs;

    adapterState.user = user;

    return Promise.resolve().then(() => {
      adapterState.flags = {};

      updateUser(user);

      adapterState.configurationStatus = TAdapterConfigurationStatus.Configured;

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
    adapterState.configurationStatus = TAdapterConfigurationStatus.Configuring;

    updateUser(adapterArgs.user);

    adapterState.flags = {};

    adapterState.configurationStatus = TAdapterConfigurationStatus.Configured;

    adapterState.emitter.emit('flagsStateChange', adapterState.flags);
    adapterState.emitter.emit('statusStateChange', {
      configurationStatus: adapterState.configurationStatus,
    });

    return Promise.resolve({
      initializationStatus: TAdapterInitializationStatus.Succeeded,
    });
  }

  getIsConfigurationStatus(configurationStatus: TAdapterConfigurationStatus) {
    return adapterState.configurationStatus === configurationStatus;
  }

  setConfigurationStatus(nextConfigurationStatus: TAdapterConfigurationStatus) {
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
    return new Promise((resolve) => {
      if (
        adapterState.configurationStatus ===
        TAdapterConfigurationStatus.Configured
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
    adapterState.subscriptionStatus = TAdapterSubscriptionStatus.Unsubscribed;
  }

  subscribe() {
    adapterState.subscriptionStatus = TAdapterSubscriptionStatus.Subscribed;
  }

  // NOTE: This function is deprecated. Please use `getIsConfigurationStatus`.
  getIsReady() {
    warning(
      false,
      '@flopflip/memory-adapter: `getIsReady` has been deprecated. Please use `getIsConfigurationStatus` instead.'
    );

    return this.getIsConfigurationStatus(
      TAdapterConfigurationStatus.Configured
    );
  }
}

const adapter = new MemoryAdapter();
export default adapter;
export { updateFlags, getUser, normalizeFlag };
