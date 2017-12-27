// @flow
import type {
  User,
  AdapterState,
  ConfigurationArgs,
  Storage,
  Flags,
  OnStatusStateChangeCallback,
  OnFlagsStateChangeCallback,
} from './types';

const adapterState: AdapterState = {
  eventHandlerMap: {},
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
  storage.set('flags', flags);

  adapterState.eventHandlerMap.onFlagsStateChange(flags);
};

const subscribeToFlagsChanges = ({
  pollingInteral = 1000 * 60,
}: {
  pollingInteral: number,
}) => {
  setInterval(() => {
    adapterState.eventHandlerMap.onFlagsStateChange(storage.get('flags'));
  }, pollingInteral);
};

const configure = ({
  user,
  onFlagsStateChange,
  onStatusStateChange,

  ...remainingArgs
}: ConfigurationArgs): Promise<any> => {
  adapterState.user = user;

  return Promise.resolve().then(() => {
    adapterState.isConfigured = true;
    adapterState.isReady = true;

    adapterState.eventHandlerMap.onFlagsStateChange = onFlagsStateChange;
    adapterState.eventHandlerMap.onStatusStateChange = onStatusStateChange;

    onStatusStateChange({ isReady: adapterState.isReady });
    onFlagsStateChange(storage.get('flags'));

    subscribeToFlagsChanges({ pollingInteral: remainingArgs.pollingInteral });
  });
};

const reconfigure = ({ user }: { user: User }): Promise<any> => {
  storage.unset('flags');

  adapterState.eventHandlerMap['onFlagsStateChange']({});

  return Promise.resolve();
};

export default {
  configure,
  reconfigure,
};
