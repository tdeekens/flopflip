// @flow
import invariant from 'invariant';
import mitt from 'mitt';

import type {
  User,
  AdapterState,
  AdapterArgs,
  Flags,
  OnStatusStateChangeCallback,
  OnFlagsStateChangeCallback,
} from '@flopflip/types';

type Storage = {
  get: (key: string) => ?string,
  set: (key: string, value: mixed) => boolean,
  unset: (key: string) => void,
};

const intialAdapterState: AdapterState = {
  isReady: false,
  flags: {},
  user: {},
  emitter: mitt(),
};

let adapterState: AdapterState = {
  ...intialAdapterState,
};

export const STORAGE_SLICE: string = '@flopflip';

const storage: Storage = {
  get: key => {
    const localStorageValue = localStorage.getItem(`${STORAGE_SLICE}__${key}`);

    return localStorageValue ? JSON.parse(localStorageValue) : null;
  },
  set: (key, value) => {
    try {
      localStorage.setItem(`${STORAGE_SLICE}__${key}`, JSON.stringify(value));
      return true;
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

  storage.set('flags', flags);

  adapterState.emitter.emit('flagsStateChange', flags);
};

const subscribeToFlagsChanges = ({
  pollingInteral = 1000 * 60,
}: {
  pollingInteral: number,
}) => {
  setInterval(() => {
    adapterState.onFlagsStateChange(storage.get('flags'));
  }, pollingInteral);
};

const configure = ({
  user,
  onFlagsStateChange,
  onStatusStateChange,

  ...remainingArgs
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

    subscribeToFlagsChanges({ pollingInteral: remainingArgs.pollingInteral });
  });
};

const reconfigure = ({ user }: { user: User }): Promise<any> => {
  storage.unset('flags');

  adapterState.emitter.emit('flagsStateChange', {});

  return Promise.resolve();
};

const waitUntilConfigured = (): Promise<any> =>
  new Promise(resolve => {
    if (adapterState.isConfigured) resolve();
    else adapterState.emitter.on('readyStateChange', resolve);
  });
const getIsReady = (): boolean => adapterState.isReady;

export default {
  configure,
  waitUntilConfigured,
  getIsReady,
  reconfigure,
};
