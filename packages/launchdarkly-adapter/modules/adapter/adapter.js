// @flow
import type {
  FlagName,
  FlagVariation,
  User,
  Flag,
  Flags,
  OnFlagsStateChangeCallback,
  OnStatusStateChangeCallback,
} from '@flopflip/types';
import warning from 'warning';
import isEqual from 'lodash.isequal';
import { initialize } from 'ldclient-js';
import camelCase from 'lodash.camelcase';

type Client = {
  identify: (nextUser: User) => Promise<Object>,
  waitUntilReady: () => Promise<any>,
  on: (eventName: string, (flagName: FlagName) => void) => void,
  allFlags: () => Flags | null,
};
type AdapterState = {
  isReady: boolean,
  isConfigured: boolean,
  user: ?User,
  client: ?Client,
};

const adapterState: AdapterState = {
  isReady: false,
  isConfigured: false,
  user: null,
  client: null,
};

const normalizeFlag = (flagName: FlagName, flagValue?: FlagVariation): Flag => [
  camelCase(flagName),
  // Multi variate flags contain a string or `null` - `false` seems more natural.
  flagValue === null || flagValue === undefined ? false : flagValue,
];

const subscribeToFlagsChanges = ({
  rawFlags,
  onFlagsStateChange,
}: {
  rawFlags: Flags,
  onFlagsStateChange: OnFlagsStateChangeCallback,
}) => {
  for (const flagName in rawFlags) {
    // Dispatch whenever a configured flag value changes
    if (
      Object.prototype.hasOwnProperty.call(rawFlags, flagName) &&
      adapterState.client
    ) {
      adapterState.client.on(`change:${flagName}`, flagValue => {
        const [normalizedFlagName, normalizedFlagValue] = normalizeFlag(
          flagName,
          flagValue
        );

        onFlagsStateChange({
          [normalizedFlagName]: normalizedFlagValue,
        });
      });
    }
  }
};

// NOTE: Exported for testing only
export const createAnonymousUserKey = (): string =>
  Math.random()
    .toString(36)
    .substring(2);

const ensureUser = (user: User): User => ({
  key: user && user.key ? user.key : createAnonymousUserKey(),
  ...user,
});
const initializeClient = (clientSideId: string, user: User): Client =>
  initialize(clientSideId, user);
const changeUserContext = (nextUser: User): Promise<any> =>
  adapterState.client && adapterState.client.identify
    ? adapterState.client.identify(nextUser)
    : Promise.reject(
        new Error('Can not change user context: client not yet initialized.')
      );
const updateUserContext = (updatedUserProps: User): Promise<any> => {
  const isAdapterReady = adapterState.isConfigured && adapterState.isReady;

  warning(
    isAdapterReady,
    '@flopflip/launchdarkly-adapter: adapter not ready and configured. User context can not be updated before.'
  );

  if (!isAdapterReady)
    return Promise.reject(
      new Error('Can not update user context: adapter not yet ready.')
    );

  return changeUserContext({ ...adapterState.user, ...updatedUserProps });
};

// NOTE: Exported for testing only
export const camelCaseFlags = (rawFlags: Flags): Flags =>
  Object.entries(rawFlags).reduce((camelCasedFlags, [flagName, flagValue]) => {
    const [normalizedFlagName, normalizedFlagValue]: Flag = normalizeFlag(
      flagName,
      flagValue
    );
    // Can't return expression as it is the assigned value
    camelCasedFlags[normalizedFlagName] = normalizedFlagValue;

    return camelCasedFlags;
  }, {});

const subscribe = ({
  onFlagsStateChange,
  onStatusStateChange,
}: {
  onFlagsStateChange: OnFlagsStateChangeCallback,
  onStatusStateChange: OnStatusStateChangeCallback,
}): Promise<any> => {
  if (adapterState.client) {
    return adapterState.client.waitUntilReady().then(() => {
      const rawFlags = adapterState.client
        ? adapterState.client.allFlags()
        : null;
      // First update internal state
      adapterState.isReady = true;
      // ...to then signal that the adapter is ready
      onStatusStateChange({ isReady: true });
      if (rawFlags) {
        // ...and flush initial state of flags
        onFlagsStateChange(camelCaseFlags(rawFlags));
        // ...to finally subscribe to later changes.
        subscribeToFlagsChanges({
          rawFlags,
          onFlagsStateChange,
        });
      }
    });
  } else {
    return Promise.reject(
      new Error('Can not subscribte with non initialized client.')
    );
  }
};

const configure = ({
  clientSideId,
  user,
  onFlagsStateChange,
  onStatusStateChange,
}: {
  clientSideId: string,
  user: User,
  onFlagsStateChange: OnFlagsStateChangeCallback,
  onStatusStateChange: OnStatusStateChangeCallback,
}): Promise<any> => {
  adapterState.user = ensureUser(user);
  adapterState.client = initializeClient(clientSideId, adapterState.user);

  return subscribe({
    onFlagsStateChange,
    onStatusStateChange,
  }).then(() => {
    adapterState.isConfigured = true;

    return adapterState.client;
  });
};

const reconfigure = ({ user: nextUser }: { user: User }): Promise<any> => {
  if (!adapterState.isReady || !adapterState.isConfigured || !adapterState.user)
    return Promise.reject(
      new Error(
        '@flopflip/launchdarkly-adapter: please configure adapter before reconfiguring.'
      )
    );

  if (adapterState.user && !isEqual(adapterState.user, nextUser)) {
    adapterState.user = ensureUser(nextUser);

    return changeUserContext(adapterState.user);
  }

  return Promise.resolve();
};

export default {
  configure,
  reconfigure,
  updateUserContext,
};
