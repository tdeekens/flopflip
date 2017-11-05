const adapterState = {
  flags: {},
  user: {},
  eventHandlerMap: {},
};

const configure = ({ user, onFlagsStateChange, onStatusStateChange }) => {
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

const reconfigure = ({ user }) => {
  updateUser(user);

  adapterState.flags = {};
  adapterState.eventHandlerMap['onFlagsStateChange']({});

  return Promise.resolve();
};

const updateUser = user => {
  adapterState.user = user;
};

export const updateFlags = flags => {
  adapterState.flags = {
    ...adapterState.flags,
    ...flags,
  };

  adapterState.eventHandlerMap['onFlagsStateChange'](adapterState.flags);
};

export const getUser = () => adapterState.user;

export default {
  configure,
  reconfigure,
};
