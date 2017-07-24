import ldClient from 'ldclient-js';
import camelCase from 'lodash.camelcase';
import uuid from './uuid';
import { updateStatus, updateFlags } from './../actions/ducks';

const createAnonymousUser = () => ({
  key: uuid(),
});

const normalizeFlag = (flagName, flagValue) => [
  camelCase(flagName),
  // Multivariate flags contain a string or `null` - `false` seems
  // more natural.
  flagValue === null ? false : flagValue,
];

const camelCaseFlags = rawFlags =>
  Object.entries(rawFlags).reduce((camelCasedFlags, [flagName, flagValue]) => {
    const [normalzedFlagName, normalzedFlagValue] = normalizeFlag(
      flagName,
      flagValue
    );
    // Can't return expression as it is the assigned value
    camelCasedFlags[normalzedFlagName] = normalzedFlagValue;

    return camelCasedFlags;
  }, {});

export const initialize = ({ clientSideId, user }) =>
  ldClient.initialize(clientSideId, user || createAnonymousUser());

export const flagUpdates = ({ rawFlags, client, dispatch }) => {
  // Dispatch whenever configured flag value changes
  for (const flagName in rawFlags) {
    if (Object.prototype.hasOwnProperty.call(rawFlags, flagName)) {
      client.on(`change:${flagName}`, flagValue => {
        const [normalzedFlagName, normalzedFlagValue] = normalizeFlag(
          flagName,
          flagValue
        );

        dispatch(
          updateFlags({
            [normalzedFlagName]: normalzedFlagValue,
          })
        );
      });
    }
  }
};

export const listen = ({ client, dispatch }) => {
  client.on('ready', () => {
    dispatch(updateStatus({ isReady: true }));

    const rawFlags = client.allFlags();
    const camelCasedFlags = camelCaseFlags(rawFlags);

    dispatch(updateFlags(camelCasedFlags));

    flagUpdates({ rawFlags, client, dispatch });
  });
};
