import invariant from 'invariant';
import mitt, { Emitter } from 'mitt';
import camelCase from 'lodash/camelCase';
import {
  User,
  AdapterStatus,
  AdapterEventHandlers,
  LocalStorageAdapterInterface,
  LocalStorageAdapterArgs,
  FlagName,
  FlagVariation,
  Flag,
  Flags,
  interfaceIdentifiers,
} from '@flopflip/types';

type Storage = {
  get: (key: string) => any;
  set: (key: string, value: any) => boolean;
  unset: (key: string) => void;
};

type LocalStorageAdapterState = {
  flags: Flags;
  user?: User;
  emitter: Emitter;
};
const intialAdapterState: AdapterStatus & LocalStorageAdapterState = {
  isReady: false,
  flags: {},
  user: {},
  // Typings are incorrect and state that mitt is not callable.
  // Value of type 'MittStatic' is not callable. Did you mean to include 'new'
  // @ts-ignore
  emitter: mitt(),
};

let adapterState: AdapterStatus & LocalStorageAdapterState = {
  ...intialAdapterState,
};

export const STORAGE_SLICE = '@flopflip';

const normalizeFlag = (flagName: FlagName, flagValue?: FlagVariation): Flag => [
  camelCase(flagName),
  // Multi variate flags contain a string or `null` - `false` seems more natural.
  flagValue === null || flagValue === undefined ? false : flagValue,
];
export const normalizeFlags = (rawFlags: Flags): Flags => {
  if (!rawFlags) return {};

  return Object.entries(rawFlags).reduce<Flags>(
    (normalizedFlags: Flags, [flagName, flagValue]) => {
      const [normalizedFlagName, normalizedFlagValue]: Flag = normalizeFlag(
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
export const updateFlags = (flags: Flags): void => {
  const isAdapterReady = Boolean(
    adapterState.isConfigured && adapterState.isReady
  );

  invariant(
    isAdapterReady,
    '@flopflip/localstorage-adapter: adapter not ready and configured. Flags can not be updated before.'
  );

  if (!isAdapterReady) return;

  const previousFlags: Flags | null = storage.get('flags') as Flags;
  const nextFlags: Flags = normalizeFlags({
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
}): void => {
  setInterval(() => {
    adapterState.emitter.emit(
      'flagsStateChange',
      normalizeFlags(storage.get('flags'))
    );
  }, pollingInteral);
};

class LocalStorageAdapter implements LocalStorageAdapterInterface {
  id: typeof interfaceIdentifiers.localstorage;

  constructor() {
    this.id = interfaceIdentifiers.localstorage;
  }

  configure(
    adapterArgs: LocalStorageAdapterArgs,
    adapterEventHandlers: AdapterEventHandlers
  ): Promise<any> {
    const { user, adapterConfiguration } = adapterArgs;

    adapterState.user = user;

    return Promise.resolve().then(() => {
      adapterState.isConfigured = true;
      adapterState.isReady = true;

      adapterState.emitter.on(
        'flagsStateChange',
        adapterEventHandlers.onFlagsStateChange
      );
      adapterState.emitter.on(
        'statusStateChange',
        adapterEventHandlers.onStatusStateChange
      );

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
    adapterArgs: LocalStorageAdapterArgs,
    _adapterEventHandlers: AdapterEventHandlers
  ): Promise<any> {
    storage.unset('flags');
    const nextUser = adapterArgs.user;
    adapterState.user = nextUser;
    adapterState.emitter.emit('flagsStateChange', {});
    return Promise.resolve();
  }

  waitUntilConfigured(): Promise<any> {
    return new Promise(resolve => {
      if (adapterState.isConfigured) resolve();
      else adapterState.emitter.on('readyStateChange', resolve);
    });
  }

  getIsReady(): boolean {
    return Boolean(adapterState.isReady);
  }
}

const adapter = new LocalStorageAdapter();
export default adapter;
