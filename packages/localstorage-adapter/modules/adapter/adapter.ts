import invariant from 'invariant';
import mitt, { Emitter } from 'mitt';
import { User, AdapterStatus, AdapterArgs, Flags } from '@flopflip/types';

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
  // @ts-ignore
  emitter: mitt(),
};

let adapterState: AdapterStatus & LocalStorageAdapterState = {
  ...intialAdapterState,
};

export const STORAGE_SLICE = '@flopflip';

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
  const nextFlags: Flags = {
    ...previousFlags,
    ...flags,
  };

  storage.set('flags', nextFlags);

  adapterState.emitter.emit('flagsStateChange', nextFlags);
};

const subscribeToFlagsChanges = ({
  pollingInteral = 1000 * 60,
}: {
  pollingInteral: number;
}): void => {
  setInterval(() => {
    adapterState.emitter.emit('flagsStateChange', storage.get('flags'));
  }, pollingInteral);
};

const configure = ({
  user,
  onFlagsStateChange,
  onStatusStateChange,
  adapterConfiguration,
}: AdapterArgs): Promise<any> => {
  adapterState.user = user;

  return Promise.resolve().then(() => {
    adapterState.isConfigured = true;
    adapterState.isReady = true;

    adapterState.emitter.on('flagsStateChange', onFlagsStateChange);
    adapterState.emitter.on('statusStateChange', onStatusStateChange);

    adapterState.emitter.emit('flagsStateChange', storage.get('flags'));
    adapterState.emitter.emit('statusStateChange', {
      isReady: adapterState.isReady,
    });

    adapterState.emitter.emit('readyStateChange');

    subscribeToFlagsChanges({
      pollingInteral:
        adapterConfiguration && adapterConfiguration.pollingInteral,
    });
  });
};

const reconfigure = ({ user: nextUser }: { user: User }): Promise<any> => {
  storage.unset('flags');
  adapterState.user = nextUser;

  adapterState.emitter.emit('flagsStateChange', {});

  return Promise.resolve();
};

const waitUntilConfigured = (): Promise<any> =>
  new Promise(resolve => {
    if (adapterState.isConfigured) resolve();
    else adapterState.emitter.on('readyStateChange', resolve);
  });
const getIsReady = (): boolean => Boolean(adapterState.isReady);

export default {
  configure,
  waitUntilConfigured,
  getIsReady,
  reconfigure,
};
