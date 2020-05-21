import type { DeepReadonly } from 'ts-essentials';
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
} from '@flopflip/types';
import {
  TLocalStorageAdapterInterface,
  TAdapterSubscriptionStatus,
  TAdapterConfigurationStatus,
  TAdapterInitializationStatus,
  interfaceIdentifiers,
} from '@flopflip/types';

import warning from 'tiny-warning';
import mitt, { Emitter } from 'mitt';
import camelCase from 'lodash/camelCase';
import isEqual from 'lodash/isEqual';

type Storage = {
  get: (key: string) => any;
  set: (key: string, value: any) => boolean;
  unset: (key: string) => void;
};

type LocalStorageAdapterState = {
  flags: TFlags;
  user?: TUser;
  emitter: Emitter;
};

const intialAdapterState: TAdapterStatus & LocalStorageAdapterState = {
  subscriptionStatus: TAdapterSubscriptionStatus.Subscribed,
  configurationStatus: TAdapterConfigurationStatus.Unconfigured,
  flags: {},
  user: {},
  // Typings are incorrect and state that mitt is not callable.
  // Value of type 'MittStatic' is not callable. Did you mean to include 'new'
  emitter: mitt(),
};

let adapterState: TAdapterStatus & LocalStorageAdapterState = {
  ...intialAdapterState,
};

const getIsUnsubscribed = () =>
  adapterState.subscriptionStatus === TAdapterSubscriptionStatus.Unsubscribed;

export const STORAGE_SLICE = '@flopflip';

const normalizeFlag = (
  flagName: TFlagName,
  flagValue?: TFlagVariation
): TFlag => [
  camelCase(flagName),
  // Multi variate flags contain a string or `null` - `false` seems more natural.
  flagValue === null || flagValue === undefined ? false : flagValue,
];
export const normalizeFlags = (rawFlags: Readonly<TFlags>) => {
  if (!rawFlags) return {};

  return Object.entries(rawFlags).reduce<TFlags>(
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
};

const storage: Storage = {
  get: (key) => {
    const localStorageValue = localStorage.getItem(`${STORAGE_SLICE}__${key}`);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return localStorageValue ? JSON.parse(localStorageValue) : null;
  },
  set: (key, value) => {
    try {
      localStorage.setItem(`${STORAGE_SLICE}__${key}`, JSON.stringify(value));
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return false;
    }
  },
  unset: (key) => localStorage.removeItem(`${STORAGE_SLICE}__${key}`),
};
export const updateFlags = (flags: Readonly<TFlags>) => {
  const isAdapterConfigured =
    adapterState.configurationStatus === TAdapterConfigurationStatus.Configured;

  warning(
    isAdapterConfigured,
    '@flopflip/localstorage-adapter: adapter not configured. Flags can not be updated before.'
  );

  if (!isAdapterConfigured) return;

  const previousFlags: TFlags | null = storage.get('flags') as TFlags;
  const nextFlags: TFlags = normalizeFlags({
    ...previousFlags,
    ...flags,
  });

  storage.set('flags', nextFlags);
  adapterState.flags = nextFlags;

  adapterState.emitter.emit('flagsStateChange', nextFlags);
};

const didFlagsChange = (nextFlags: Readonly<TFlags>) => {
  const previousFlags = adapterState.flags;

  if (previousFlags === undefined) return true;

  return !isEqual(nextFlags, previousFlags);
};

const subscribeToFlagsChanges = ({
  pollingInteral = 1000 * 60,
}: Readonly<TLocalStorageAdapterSubscriptionOptions>) => {
  setInterval(() => {
    if (!getIsUnsubscribed()) {
      const nextFlags = normalizeFlags(storage.get('flags'));

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
    adapterArgs: DeepReadonly<TLocalStorageAdapterArgs>,
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

    const { user, adapterConfiguration } = adapterArgs;

    adapterState.user = user;

    return Promise.resolve().then(() => {
      adapterState.configurationStatus = TAdapterConfigurationStatus.Configured;

      const flags = normalizeFlags(storage.get('flags'));

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
        initializationStatus: TAdapterInitializationStatus.Succeeded,
      };
    });
  }

  async reconfigure(
    adapterArgs: DeepReadonly<TLocalStorageAdapterArgs>,
    _adapterEventHandlers: DeepReadonly<TAdapterEventHandlers>
  ) {
    storage.unset('flags');
    adapterState.flags = {};

    const nextUser = adapterArgs.user;
    adapterState.user = nextUser;

    adapterState.emitter.emit('flagsStateChange', {});

    return Promise.resolve({
      initializationStatus: TAdapterInitializationStatus.Succeeded,
    });
  }

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

  getIsConfigurationStatus(configurationStatus: TAdapterConfigurationStatus) {
    return adapterState.configurationStatus === configurationStatus;
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
      '@flopflip/localstorage-adapter: `getIsReady` has been deprecated. Please use `getIsConfigurationStatus` instead.'
    );

    return this.getIsConfigurationStatus(
      TAdapterConfigurationStatus.Configured
    );
  }
}

const adapter = new LocalStorageAdapter();
export default adapter;
