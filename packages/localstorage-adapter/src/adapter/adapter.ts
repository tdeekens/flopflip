import type {
  TUser,
  TAdapterStatus,
  TAdapterStatusChange,
  TAdapterEventHandlers,
  TLocalStorageAdapterArgs,
  TFlagName,
  TFlagVariation,
  TFlag,
  TFlags,
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

import warning from 'tiny-warning';
import mitt, { Emitter } from 'mitt';
import camelCase from 'lodash/camelCase';
import isEqual from 'lodash/isEqual';
import getGlobalThis from 'globalthis';
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

const getIsAdapterUnsubscribed = () =>
  adapterState.subscriptionStatus === AdapterSubscriptionStatus.Unsubscribed;
const getIsFlagLocked = (flagName: TFlagName) =>
  adapterState.lockedFlags.has(flagName);

const STORAGE_SLICE = '@flopflip';
const cache = createCache({ prefix: STORAGE_SLICE });

const normalizeFlag = (
  flagName: TFlagName,
  flagValue?: TFlagVariation
): TFlag => [
  camelCase(flagName),
  // Multi variate flags contain a string or `null` - `false` seems more natural.
  flagValue === null || flagValue === undefined ? false : flagValue,
];
const normalizeFlags = (rawFlags: TFlags): Record<'string', TFlagVariation> =>
  Object.entries(rawFlags || {}).reduce<TFlags>(
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

const updateFlags: TFlagsUpdateFunction = (flags, options) => {
  const isAdapterConfigured =
    adapterState.configurationStatus === AdapterConfigurationStatus.Configured;

  warning(
    isAdapterConfigured,
    '@flopflip/localstorage-adapter: adapter not configured. Flags can not be updated before.'
  );

  if (!isAdapterConfigured) return;

  const previousFlags: TFlags | null = cache.get('flags') as TFlags;

  const updatedFlags = Object.entries(flags).reduce(
    (updatedFlags, [flagName, flagValue]) => {
      const [normalizedFlagName, normalizedFlagValue] = normalizeFlag(
        flagName,
        flagValue
      );

      if (getIsFlagLocked(normalizedFlagName)) return updatedFlags;

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

  cache.set('flags', nextFlags);
  adapterState.flags = nextFlags;

  adapterState.emitter.emit('flagsStateChange', nextFlags);
};

const didFlagsChange = (nextFlags: TFlags) => {
  const previousFlags = adapterState.flags;

  if (previousFlags === undefined) return true;

  return !isEqual(nextFlags, previousFlags);
};

const subscribeToFlagsChanges = ({
  pollingInteral = 1000 * 60,
}: TLocalStorageAdapterSubscriptionOptions) => {
  setInterval(() => {
    if (!getIsAdapterUnsubscribed()) {
      const nextFlags = normalizeFlags(cache.get('flags'));

      if (didFlagsChange(nextFlags)) {
        adapterState.flags = nextFlags;
        adapterState.emitter.emit('flagsStateChange', nextFlags);
      }
    }
  }, pollingInteral);
};

const __internalConfiguredStatusChange__ = '__internalConfiguredStatusChange__';

class LocalStorageAdapter implements TLocalStorageAdapterInterface {
  id: typeof interfaceIdentifiers.localstorage;

  constructor() {
    this.id = interfaceIdentifiers.localstorage;
  }

  async configure(
    adapterArgs: TLocalStorageAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) {
    const handleFlagsChange = (nextFlags: TFlags) => {
      if (getIsAdapterUnsubscribed()) return;

      adapterEventHandlers.onFlagsStateChange(nextFlags);
    };

    const handleStatusChange = (nextStatus: TAdapterStatusChange) => {
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

    const { user, adapterConfiguration } = adapterArgs;

    adapterState.user = user;

    return Promise.resolve().then(() => {
      adapterState.configurationStatus = AdapterConfigurationStatus.Configured;

      const flags = normalizeFlags(cache.get('flags'));

      adapterState.flags = flags;
      adapterState.emitter.emit('flagsStateChange', flags);
      adapterState.emitter.emit('statusStateChange', {
        configurationStatus: adapterState.configurationStatus,
      });
      adapterState.emitter.emit(__internalConfiguredStatusChange__);

      subscribeToFlagsChanges({
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
    cache.unset('flags');
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
      else adapterState.emitter.on(__internalConfiguredStatusChange__, resolve);
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

const exposeGlobally = () => {
  const globalThis = getGlobalThis();

  if (!globalThis.__flopflip__) {
    globalThis.__flopflip__ = {};
  }

  globalThis.__flopflip__.localstorage = {
    adapter,
    updateFlags,
  };
};

exposeGlobally();

export default adapter;
export { updateFlags, STORAGE_SLICE, normalizeFlag };
