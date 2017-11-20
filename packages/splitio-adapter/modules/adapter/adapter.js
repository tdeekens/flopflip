import splitio from '@splitsoftware/splitio';
import camelCase from 'camelcase';

const adapterState = {
  isReady: false,
  isConfigured: false,
  user: null,
  client: null,
  manager: null,
};

const normalizeFlag = (flagName, flagValue) => {
  let value;
  if (flagValue === null) {
    value = false;
  } else if (flagValue === 'on') {
    value = true;
  } else if (flagValue === 'off') {
    value = false;
  } else {
    value = flagValue;
  }
  return {
    name: camelCase(flagName),
    value,
  };
};

export const camelCaseFlags = flags =>
  Object.entries(flags).reduce((acc, [flagName, flaValue]) => {
    const { name, value } = normalizeFlag(flagName, flaValue);
    acc[name] = value;
    return acc;
  }, {});

const subscribeToFlagsChanges = ({ names, onFlagsStateChange }) => {
  adapterState.client.on(adapterState.client.Event.SDK_UPDATE, () => {
    const flags = adapterState.client.getTreatments(names, adapterState.user);
    onFlagsStateChange(camelCaseFlags(flags));
  });
};

export const createAnonymousUserKey = () =>
  Math.random()
    .toString(36)
    .substring(2);

const ensureUser = user => ({
  key: user && user.key ? user.key : createAnonymousUserKey(),
  ...user,
});

const initializeUserContext = (clientSideId, user) => {
  const factory = splitio({
    core: {
      authorizationKey: clientSideId,
      key: user.key,
    },
  });
  return {
    client: factory.client(),
    manager: factory.manager(),
  };
};

const subscribe = ({ onFlagsStateChange, onStatusStateChange }) =>
  new Promise(resolve => {
    adapterState.client.on(adapterState.client.Event.SDK_READY, () => {
      const names = adapterState.manager.names();
      const flags = adapterState.client.getTreatments(names, adapterState.user);

      // First update internal state
      adapterState.isReady = true;
      // ...to then signal that the adapter is ready
      onStatusStateChange({ isReady: true });
      // ...and flush initial state of flags
      onFlagsStateChange(camelCaseFlags(flags));
      // ...to finally subscribe to later changes.
      subscribeToFlagsChanges({
        names,
        onFlagsStateChange,
      });

      return resolve();
    });
  });

const configure = ({
  clientSideId,
  user,
  onFlagsStateChange,
  onStatusStateChange,
}) => {
  adapterState.user = ensureUser(user);
  const { client, manager } = initializeUserContext(
    clientSideId,
    adapterState.user
  );
  adapterState.client = client;
  adapterState.manager = manager;

  return subscribe({
    onFlagsStateChange,
    onStatusStateChange,
  }).then(() => {
    adapterState.isConfigured = true;

    return adapterState.client;
  });
};

const reconfigure = ({ user, onFlagsStateChange }) =>
  new Promise((resolve, reject) => {
    if (
      !adapterState.isReady ||
      !adapterState.isConfigured ||
      !adapterState.user
    )
      return reject(
        new Error(
          '@flopflip/splitio-adapter: please configure adapter before reconfiguring.'
        )
      );

    if (adapterState.user.key !== user.key) {
      adapterState.user = ensureUser(user);
      const names = adapterState.manager.names();
      const flags = adapterState.client.getTreatments(names, adapterState.user);
      onFlagsStateChange(camelCaseFlags(flags));
    }

    return resolve();
  });

export default {
  configure,
  reconfigure,
};
