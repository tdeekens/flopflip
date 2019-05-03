import {
  FlagName,
  FlagVariation,
  User,
  Flag,
  Flags,
  OnFlagsStateChangeCallback,
  OnStatusStateChangeCallback,
} from '@flopflip/types';
import merge from 'deepmerge';
import warning from 'tiny-warning';
import isEqual from 'lodash/isEqual';
import {
  initialize as initializeLaunchDarklyClient,
  LDUser,
  LDClient,
} from 'ldclient-js';
import camelCase from 'lodash/camelCase';

type ClientOptions = {
  fetchGoals?: boolean;
};
type AdapterState = {
  isReady: boolean;
  isConfigured: boolean;
  user?: User;
  client?: LDClient;
  flags?: Flags;
};

const adapterState: AdapterState = {
  isReady: false,
  isConfigured: false,
  user: undefined,
  client: undefined,
  flags: undefined,
};

const updateFlagsInAdapterState = (updatedFlags: Flags): void => {
  adapterState.flags = {
    ...adapterState.flags,
    ...updatedFlags,
  };
};

const getFlag = (flagName: FlagName): FlagVariation | undefined =>
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
  flagsFromSdk: Flags;
  onFlagsStateChange: OnFlagsStateChangeCallback;
}): void => {
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

        const flags: Flags = {
          [normalizedFlagName]: normalizedFlagValue,
        };

        updateFlagsInAdapterState(flags);
        onFlagsStateChange(flags);
      });
    }
  }
};

const getIsAnonymousUser = (user: User): boolean => !(user && user.key);
const ensureUser = (user: User): User => {
  const isAnonymousUser = getIsAnonymousUser(user);

  // NOTE: When marked `anonymous` the SDK will generate a unique key and cache it in local storage
  return merge(user, {
    key: isAnonymousUser ? undefined : user.key,
    anonymous: isAnonymousUser,
  });
};

const initializeClient = (
  clientSideId: string,
  user: User,
  clientOptions: ClientOptions
): LDClient =>
  initializeLaunchDarklyClient(clientSideId, user as LDUser, clientOptions);
const changeUserContext = (nextUser: User): Promise<any> =>
  adapterState.client && adapterState.client.identify
    ? adapterState.client.identify(nextUser as LDUser)
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
  Object.entries(rawFlags).reduce<Flags>(
    (camelCasedFlags: Flags, [flagName, flagValue]) => {
      const [normalizedFlagName, normalizedFlagValue]: Flag = normalizeFlag(
        flagName,
        flagValue
      );
      // Can't return expression as it is the assigned value
      camelCasedFlags[normalizedFlagName] = normalizedFlagValue;

      return camelCasedFlags;
    },
    {}
  );

const getInitialFlags = ({
  onFlagsStateChange,
  onStatusStateChange,
}: {
  onFlagsStateChange: OnFlagsStateChangeCallback;
  onStatusStateChange: OnStatusStateChangeCallback;
}): Promise<{ flagsFromSdk: Flags }> => {
  return new Promise((resolve, reject) => {
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

          return resolve({ flagsFromSdk });
        }
      });
    }

    return reject(new Error('Can not subscribte with non initialized client.'));
  });
};

const configure = ({
  clientSideId,
  user,
  clientOptions = {},
  onFlagsStateChange,
  onStatusStateChange,
  subscribeToFlagChanges = true,
}: {
  clientSideId: string;
  user: User;
  clientOptions: ClientOptions;
  onFlagsStateChange: OnFlagsStateChangeCallback;
  onStatusStateChange: OnStatusStateChangeCallback;
  subscribeToFlagChanges: boolean;
}): Promise<any> => {
  adapterState.user = ensureUser(user);
  adapterState.client = initializeClient(
    clientSideId,
    adapterState.user,
    clientOptions
  );
  adapterState.isConfigured = true;

  return getInitialFlags({
    onFlagsStateChange,
    onStatusStateChange,
  }).then(({ flagsFromSdk }) => {
    if (subscribeToFlagChanges)
      setupFlagSubcription({
        flagsFromSdk,
        onFlagsStateChange,
      });

    return adapterState.client;
  });
};

const reconfigure = ({ user: nextUser }: { user: User }): Promise<any> => {
  if (!adapterState.isConfigured)
    return Promise.reject(
      new Error(
        '@flopflip/launchdarkly-adapter: please configure adapter before reconfiguring.'
      )
    );

  if (!isEqual(adapterState.user, nextUser)) {
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
