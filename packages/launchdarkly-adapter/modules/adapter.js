import ldClient from 'ldclient-js';
import camelCase from 'lodash.camelcase';
import nanoid from 'nanoid';

const normalizeFlag = (flagName, flagValue) => [
  camelCase(flagName),
  // Multivariate flags contain a string or `null` - `false` seems
  // more natural.
  flagValue === null ? false : flagValue,
];

const flagUpdates = ({ rawFlags, client, onFlagsStateChange }) => {
  // Dispatch whenever configured flag value changes
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

const changeUserContext = ({ client, nextUser }) => client.identify(nextUser);

export const createAnonymousUser = () => ({
  key: nanoid(),
});

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

const configure = ({ clientSideId, user }) =>
  ldClient.initialize(
    clientSideId,
    user && user.key ? user : createAnonymousUser()
  );

const subscribe = ({ client, onFlagsStateChange, onStatusStateChange }) => {
  client.on('ready', () => {
    onStatusStateChange({ isReady: true });

    const rawFlags = client.allFlags();
    const camelCasedFlags = camelCaseFlags(rawFlags);

    onFlagsStateChange(camelCasedFlags);

    flagUpdates({ rawFlags, client, onFlagsStateChange });
  });
};

export default {
  configure,
  subscribe,
  changeUserContext,
};
