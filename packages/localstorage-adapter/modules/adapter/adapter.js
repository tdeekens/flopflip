// @flow
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

const adapterState: AdapterState = {};

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
  storage.set('flags', flags);

  adapterState.onFlagsStateChange(flags);
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

    adapterState.onFlagsStateChange = onFlagsStateChange;
    adapterState.onStatusStateChange = onStatusStateChange;

    onStatusStateChange({ isReady: adapterState.isReady });
    onFlagsStateChange(storage.get('flags'));

    subscribeToFlagsChanges({ pollingInteral: remainingArgs.pollingInteral });
  });
};

const reconfigure = ({ user }: { user: User }): Promise<any> => {
  storage.unset('flags');

  adapterState['onFlagsStateChange']({});

  return Promise.resolve();
};

export default {
  configure,
  reconfigure,
};
