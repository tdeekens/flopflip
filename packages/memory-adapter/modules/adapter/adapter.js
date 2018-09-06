// @flow
import invariant from 'invariant';

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

    adapterState.onFlagsStateChange = onFlagsStateChange;
    adapterState.onStatusStateChange = onStatusStateChange;

    onStatusStateChange({ isReady: adapterState.isReady });
    onFlagsStateChange(adapterState.flags);
  });
};

const reconfigure = ({ user }: { user: User }): Promise<any> => {
  updateUser(user);

  adapterState.flags = {};
  adapterState.onFlagsStateChange(adapterState.flags);

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
    '@flopflip/launchdarkly-memory: adapter not ready and configured. Flags can not be updated before.'
  );

  if (!isAdapterReady) return;

  adapterState.flags = {
    ...adapterState.flags,
    ...flags,
  };

  adapterState.onFlagsStateChange(adapterState.flags);
};

export const getUser = (): User => adapterState.user;

const getFlag = (flagName: FlagName): ?Flag =>
  adapterState.flags && adapterState.flags[flagName];

export default {
  getIsReady,
  getFlag,
  reset,
  configure,
  reconfigure,
};
