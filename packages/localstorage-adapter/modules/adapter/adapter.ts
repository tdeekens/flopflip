import warning from 'tiny-warning';
import mitt, { Emitter } from 'mitt';
import camelCase from 'lodash/camelCase';
import {
  TUser,
  TAdapterStatus,
  TAdapterEventHandlers,
  TLocalStorageAdapterInterface,
  TLocalStorageAdapterArgs,
  TFlagName,
  TFlagVariation,
  TFlag,
  TFlags,
  TAdapterSubscriptionStatus,
  interfaceIdentifiers,
} from '@flopflip/types';

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
  isReady: false,
  subscriptionStatus: TAdapterSubscriptionStatus.Subscribed,
  flags: {},
  user: {},
  // Typings are incorrect and state that mitt is not callable.
  // Value of type 'MittStatic' is not callable. Did you mean to include 'new'
  // @ts-ignore
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
export const normalizeFlags = (rawFlags: TFlags) => {
  if (!rawFlags) return {};

  return Object.entries(rawFlags).reduce<TFlags>(
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
  get: key => {
    const localStorageValue = localStorage.getItem(`${STORAGE_SLICE}__${key}`);

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
  unset: key => localStorage.removeItem(`${STORAGE_SLICE}__${key}`),
};
export const updateFlags = (flags: TFlags) => {
  const isAdapterReady = Boolean(
    adapterState.isConfigured && adapterState.isReady
  );

  warning(
    isAdapterReady,
    '@flopflip/localstorage-adapter: adapter not ready and configured. Flags can not be updated before.'
  );

  if (!isAdapterReady) return;

  const previousFlags: TFlags | null = storage.get('flags') as TFlags;
  const nextFlags: TFlags = normalizeFlags({
    ...previousFlags,
    ...flags,
  });

  storage.set('flags', nextFlags);

  adapterState.emitter.emit('flagsStateChange', nextFlags);
};

const subscribeToFlagsChanges = ({
  pollingInteral = 1000 * 60,
}: {
  pollingInteral?: number;
}) => {
  setInterval(() => {
    if (!getIsUnsubscribed()) {
      adapterState.emitter.emit(
        'flagsStateChange',
        normalizeFlags(storage.get('flags'))
      );
    }
  }, pollingInteral);
};

class LocalStorageAdapter implements TLocalStorageAdapterInterface {
  id: typeof interfaceIdentifiers.localstorage;

  constructor() {
    this.id = interfaceIdentifiers.localstorage;
  }

  configure(
    adapterArgs: TLocalStorageAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) {
    const { user, adapterConfiguration } = adapterArgs;

    adapterState.user = user;

    return Promise.resolve().then(() => {
      adapterState.isConfigured = true;
      adapterState.isReady = true;

      const handleFlagsChange = (nextFlags: TFlags) => {
        if (getIsUnsubscribed()) return;

        adapterEventHandlers.onFlagsStateChange(nextFlags);
      };

      const handleStatusChange = (nextStatus: TAdapterStatus) => {
        if (getIsUnsubscribed()) return;

        adapterEventHandlers.onStatusStateChange(nextStatus);
      };

      adapterState.emitter.on('flagsStateChange', handleFlagsChange);
      adapterState.emitter.on('statusStateChange', handleStatusChange);

      adapterState.emitter.emit(
        'flagsStateChange',
        normalizeFlags(storage.get('flags'))
      );
      adapterState.emitter.emit('statusStateChange', {
        isReady: adapterState.isReady,
      });
      adapterState.emitter.emit('readyStateChange');

      subscribeToFlagsChanges({
        pollingInteral: adapterConfiguration?.pollingInteral,
      });
    });
  }

  reconfigure(
    adapterArgs: TLocalStorageAdapterArgs,
    _adapterEventHandlers: TAdapterEventHandlers
  ) {
    storage.unset('flags');

    const nextUser = adapterArgs.user;
    adapterState.user = nextUser;

    adapterState.emitter.emit('flagsStateChange', {});

    return Promise.resolve();
  }

  waitUntilConfigured() {
    return new Promise(resolve => {
      if (adapterState.isConfigured) resolve();
      else adapterState.emitter.on('readyStateChange', resolve);
    });
  }

  getIsReady() {
    return Boolean(adapterState.isReady);
  }

  unsubscribe() {
    adapterState.subscriptionStatus = TAdapterSubscriptionStatus.Unsubscribed;
  }

  subscribe() {
    adapterState.subscriptionStatus = TAdapterSubscriptionStatus.Subscribed;
  }
}

const adapter = new LocalStorageAdapter();
export default adapter;
