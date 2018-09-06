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
import { initialize as initializeLaunchDarklyClient } from 'ldclient-js';
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
  flags: ?Flags,
};

const adapterState: AdapterState = {
  isReady: false,
  isConfigured: false,
  user: null,
  client: null,
  flags: null,
};

const updateFlagsInAdapterState = (updatedFlags: Flags): void => {
  adapterState.flags = {
    ...adapterState.flags,
    ...updatedFlags,
  };
};

const getFlag = (flagName: FlagName): ?Flag =>
  adapterState.flags && adapterState.flags[flagName];

const getIsReady = (): boolean => adapterState.isReady;

const normalizeFlag = (flagName: FlagName, flagValue?: FlagVariation): Flag => [
  camelCase(flagName),
  // Multi variate flags contain a string or `null` - `false` seems more natural.
  flagValue === null || flagValue === undefined ? false : flagValue,
];

const setupFlagSubcription = ({
  flagsFromSdk,
  onFlagsStateChange,
}: {
  flagsFromSdk: Flags,
  onFlagsStateChange: OnFlagsStateChangeCallback,
}) => {
  for (const flagName in flagsFromSdk) {
    // Dispatch whenever a configured flag value changes
    if (
      Object.prototype.hasOwnProperty.call(flagsFromSdk, flagName) &&
      adapterState.client
    ) {
      adapterState.client.on(`change:${flagName}`, flagValue => {
        const [normalizedFlagName, normalizedFlagValue] = normalizeFlag(
          flagName,
          flagValue
        );

        const flag: Flag = {
          [normalizedFlagName]: normalizedFlagValue,
        };

        updateFlagsInAdapterState(flag);
        onFlagsStateChange(flag);
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
  initializeLaunchDarklyClient(clientSideId, user);
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

const getInitialFlags = ({
  onFlagsStateChange,
  onStatusStateChange,
}: {
  onFlagsStateChange: OnFlagsStateChangeCallback,
  onStatusStateChange: OnStatusStateChangeCallback,
}): Promise<any> => {
  if (adapterState.client) {
    return adapterState.client.waitUntilReady().then(() => {
      const flagsFromSdk = adapterState.client
        ? adapterState.client.allFlags()
        : null;
      // First update internal state
      adapterState.isReady = true;
      // ...to then signal that the adapter is ready
      onStatusStateChange({ isReady: true });
      if (flagsFromSdk) {
        const flags: Flags = camelCaseFlags(flagsFromSdk);
        updateFlagsInAdapterState(flags);
        // ...and flush initial state of flags
        onFlagsStateChange(flags);

        return Promise.resolve({ flagsFromSdk });
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
  subscribeToFlagChanges = true,
}: {
  clientSideId: string,
  user: User,
  onFlagsStateChange: OnFlagsStateChangeCallback,
  onStatusStateChange: OnStatusStateChangeCallback,
  subscribeToFlagChanges: boolean,
}): Promise<any> => {
  adapterState.user = ensureUser(user);
  adapterState.client = initializeClient(clientSideId, adapterState.user);

  return getInitialFlags({
    onFlagsStateChange,
    onStatusStateChange,
  }).then(({ flagsFromSdk }) => {
    adapterState.isConfigured = true;

    if (subscribeToFlagChanges)
      setupFlagSubcription({
        flagsFromSdk,
        onFlagsStateChange,
      });

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
  getFlag,
  getIsReady,
  updateUserContext,
};
