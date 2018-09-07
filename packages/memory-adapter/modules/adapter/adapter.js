// @flow
import invariant from 'invariant';
import mitt from 'mitt';

import type {
  User,
  AdapterState,
  AdapterArgs,
  FlagName,
  Flag,
  Flags,
  OnStatusStateChangeCallback,
  OnFlagsStateChangeCallback,
} from '@flopflip/types';

const intialAdapterState: AdapterState = {
  isReady: false,
  flags: {},
  user: {},
  emitter: mitt(),
};

let adapterState: AdapterState = {
  ...intialAdapterState,
};

const configure = ({
  user,
  onFlagsStateChange,
  onStatusStateChange,
}: AdapterArgs): Promise<any> => {
  adapterState.user = user;

  return Promise.resolve().then(() => {
    adapterState.isConfigured = true;
    adapterState.isReady = true;
    adapterState.flags = {};

    updateUser(user);

    adapterState.emitter.on('flagsStateChange', onFlagsStateChange);
    adapterState.emitter.on('statusStateChange', onStatusStateChange);

    adapterState.emitter.emit('flagsStateChange', adapterState.flags);
    adapterState.emitter.emit('statusStateChange', {
      isReady: adapterState.isReady,
    });

    adapterState.emitter.emit('readyStateChange');
  });
};

const reconfigure = ({ user }: { user: User }): Promise<any> => {
  updateUser(user);

  adapterState.flags = {};
  adapterState.emitter.emit('flagsStateChange', adapterState.flags);

  return Promise.resolve();
};

const getIsReady = (): boolean => adapterState.isReady;

const reset = (): void => {
  adapterState = {
    ...intialAdapterState,
  };
};

const updateUser = (user: User): User => {
  adapterState.user = user;
};

export const updateFlags = (flags: Flags): void => {
  const isAdapterReady = Boolean(
    adapterState.isConfigured && adapterState.isReady
  );

  invariant(
    isAdapterReady,
    '@flopflip/memory-adapter: adapter not ready and configured. Flags can not be updated before.'
  );

  if (!isAdapterReady) return;

  adapterState.flags = {
    ...adapterState.flags,
    ...flags,
  };

  adapterState.emitter.emit('flagsStateChange', adapterState.flags);
};

export const getUser = (): User => adapterState.user;
const waitUntilConfigured = (): Promise<any> =>
  new Promise(resolve => {
    if (adapterState.isConfigured) resolve();
    else adapterState.emitter.on('readyStateChange', resolve);
  });

const getFlag = (flagName: FlagName): ?Flag =>
  adapterState.flags && adapterState.flags[flagName];

export default {
  getIsReady,
  waitUntilConfigured,
  getFlag,
  reset,
  configure,
  reconfigure,
};
