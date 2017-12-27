// @flow
import type {
  User,
  AdapterState,
  ConfigurationArgs,
  Flags,
  OnStatusStateChangeCallback,
  OnFlagsStateChangeCallback,
} from './types';

const adapterState: AdapterState = {
  flags: {},
  user: {},
};

const configure = ({
  user,
  onFlagsStateChange,
  onStatusStateChange,
}: ConfigurationArgs): Promise<any> => {
  adapterState.user = user;

  return Promise.resolve().then(() => {
    adapterState.isConfigured = true;
    adapterState.isReady = true;

    adapterState.eventHandlerMap['onFlagsStateChange'] = onFlagsStateChange;
    adapterState.eventHandlerMap['onStatusStateChange'] = onStatusStateChange;

    onStatusStateChange({ isReady: adapterState.isReady });
    onFlagsStateChange(adapterState.flags);
  });
};

const reconfigure = ({ user }: { user: User }): Promise<any> => {
  updateUser(user);

  adapterState.flags = {};
  adapterState.eventHandlerMap['onFlagsStateChange']({});

  return Promise.resolve();
};

const updateUser = (user: User): User => {
  adapterState.user = user;
};

export const updateFlags = (flags: Flags): void => {
  adapterState.flags = {
    ...adapterState.flags,
    ...flags,
  };

  adapterState.onFlagsStateChange(adapterState.flags);
};

export const getUser = (): User => adapterState.user;

export default {
  configure,
  reconfigure,
};
