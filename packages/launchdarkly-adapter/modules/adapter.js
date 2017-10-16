import ldClient from 'ldclient-js';
import camelCase from 'lodash.camelcase';
import nanoid from 'nanoid';

const state = {
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

const subscribeToFlags = ({ rawFlags, client, onFlagsStateChange }) => {
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

export const createAnonymousUser = () => ({
  key: nanoid(),
});

// NOTE: Used during testing to inject a mock client
export const injectClient = client => {
  if (process.env.NODE_ENV !== 'test')
    throw new Error(
      '@flopflip/launchdarkly-adapter: injecting a client is only allowed during testing.'
    );

  state.client = client;

  return state.client;
};

const initializeUserContext = (clientSideId, user) =>
  ldClient.initialize(
    clientSideId,
    user && user.key ? user : createAnonymousUser()
  );
const changeUserContext = (client, nextUser) => client.identify(nextUser);

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

export const subscribe = ({ onFlagsStateChange, onStatusStateChange }) => {
  if (!state.client)
    throw new Error(
      '@flopflip/launchdarkly-adapter: please configure adapter before subscribing.'
    );

  state.client.on('ready', () => {
    const rawFlags = state.client.allFlags();
    // First update internal state
    state.isReady = true;
    // ...to then signal that the adapter is ready
    onStatusStateChange({ isReady: true });
    // ...and flush initial state of flags
    onFlagsStateChange(camelCaseFlags(rawFlags));
    // ...to finally subscribe to later changes.
    subscribeToFlags({ rawFlags, client: state.client, onFlagsStateChange });
  });
};

const configure = ({
  clientSideId,
  user,
  onFlagsStateChange,
  onStatusStateChange,
}) => {
  state.client = initializeUserContext(clientSideId, user);
  state.user = user;

  subscribe({
    onFlagsStateChange,
    onStatusStateChange,
  });

  state.isConfigured = true;

  return state.client;
};

const reconfigure = ({ user }) => {
  if (!state.isReady || !state.isConfigured || !state.user)
    throw new Error(
      '@flopflip/launchdarkly-adapter: please configure adapter before reconfiguring.'
    );

  if (state.user.key !== user.key) changeUserContext(state.client, user);

  state.user = user;
};

export const isConfigured = () => state.isConfigured;
export const isReady = () => state.isReady;

export default {
  isConfigured,
  isReady,
  configure,
  reconfigure,
};
