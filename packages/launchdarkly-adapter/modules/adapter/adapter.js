import { initialize } from 'ldclient-js';
import camelCase from 'camelcase';

const adapterState = {
  isReady: false,
  isConfigured: false,
  user: null,
  client: null,
};

const normalizeFlag = (flagName, flagValue) => [
  camelCase(flagName),
  // Multivariate flags contain a string or `null` - `false` seems
  // more natural.
  flagValue === null ? false : flagValue,
];

const subscribeToFlagsChanges = ({ rawFlags, client, onFlagsStateChange }) => {
  // Dispatch whenever a configured flag value changes
  for (const flagName in rawFlags) {
    if (Object.prototype.hasOwnProperty.call(rawFlags, flagName)) {
      client.on(`change:${flagName}`, flagValue => {
        const [normalzedFlagName, normalzedFlagValue] = normalizeFlag(
          flagName,
          flagValue
        );

        onFlagsStateChange({
          [normalzedFlagName]: normalzedFlagValue,
        });
      });
    }
  }
};

// NOTE: Exported for testing only
export const createAnonymousUserKey = () =>
  Math.random()
    .toString(36)
    .substring(2);

const ensureUserFromArgs = userArgs => ({
  key: userArgs && userArgs.key ? userArgs.key : createAnonymousUserKey(),
  ...userArgs,
});
const initializeUserContext = (clientSideId, user) =>
  initialize(clientSideId, user);
const changeUserContext = (client, nextUser) => client.identify(nextUser);

// NOTE: Exported for testing only
export const camelCaseFlags = rawFlags =>
  Object.entries(rawFlags).reduce((camelCasedFlags, [flagName, flagValue]) => {
    const [normalzedFlagName, normalzedFlagValue] = normalizeFlag(
      flagName,
      flagValue
    );
    // Can't return expression as it is the assigned value
    camelCasedFlags[normalzedFlagName] = normalzedFlagValue;

    return camelCasedFlags;
  }, {});

const subscribe = ({ onFlagsStateChange, onStatusStateChange }) =>
  new Promise(resolve => {
    adapterState.client.on('ready', () => {
      const rawFlags = adapterState.client.allFlags();
      // First update internal state
      adapterState.isReady = true;
      // ...to then signal that the adapter is ready
      onStatusStateChange({ isReady: true });
      // ...and flush initial state of flags
      onFlagsStateChange(camelCaseFlags(rawFlags));
      // ...to finally subscribe to later changes.
      subscribeToFlagsChanges({
        rawFlags,
        client: adapterState.client,
        onFlagsStateChange,
      });

      return resolve();
    });
  });

const configure = ({
  clientSideId,
  onFlagsStateChange,
  onStatusStateChange,

  ...userArgs
}) => {
  adapterState.user = ensureUserFromArgs(userArgs);
  adapterState.client = initializeUserContext(clientSideId, adapterState.user);

  return subscribe({
    onFlagsStateChange,
    onStatusStateChange,
  }).then(() => {
    adapterState.isConfigured = true;

    return adapterState.client;
  });
};

const reconfigure = ({
  clientSideId,
  onFlagsStateChange,
  onStatusStateChange,

  ...userArgs
}) =>
  new Promise((resolve, reject) => {
    if (
      !adapterState.isReady ||
      !adapterState.isConfigured ||
      !adapterState.user
    )
      return reject(
        new Error(
          '@flopflip/launchdarkly-adapter: please configure adapter before reconfiguring.'
        )
      );

    if (adapterState.user.key !== userArgs.key) {
      adapterState.user = ensureUserFromArgs(userArgs);
      changeUserContext(adapterState.client, adapterState.user);
    }

    resolve();
  });

export default {
  configure,
  reconfigure,
};
