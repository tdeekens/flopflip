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
import debounce from 'debounce-fn';
import {
  initialize as initializeLaunchDarklyClient,
  LDUser,
  LDClient,
} from 'launchdarkly-js-client-sdk';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';

type ClientOptions = {
  fetchGoals?: boolean;
};
type AdapterState = {
  isReady: boolean;
  isConfigured: boolean;
  user?: User;
  client?: LDClient;
  flags: Flags;
};

const adapterState: AdapterState = {
  isReady: false,
  isConfigured: false,
  user: undefined,
  client: undefined,
  flags: {},
};

const updateFlagsInAdapterState = (updatedFlags: Flags): void => {
  adapterState.flags = {
    ...adapterState.flags,
    ...updatedFlags,
  };
};

const getFlag = (flagName: FlagName): FlagVariation | undefined =>
  adapterState.flags[flagName];

const didFlagChange = (flagName: FlagName, nextFlagValue: FlagVariation) => {
  const previousFlagValue = getFlag(flagName);

  if (previousFlagValue === undefined) return true;

  return previousFlagValue !== nextFlagValue;
};

const getIsReady = (): boolean => adapterState.isReady;

const normalizeFlag = (flagName: FlagName, flagValue?: FlagVariation): Flag => [
  camelCase(flagName),
  // Multi variate flags contain a string or `null` - `false` seems more natural.
  flagValue === null || flagValue === undefined ? false : flagValue,
];
const denormalizeFlagName = (flagName: FlagName) => kebabCase(flagName);

const setupFlagSubcription = ({
  flagsFromSdk,
  onFlagsStateChange,
  flagsUpdateDelayMs,
}: {
  flagsFromSdk: Flags;
  onFlagsStateChange: OnFlagsStateChangeCallback;
  flagsUpdateDelayMs?: number;
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

        // Sometimes the SDK flushes flag changes without a value having changed.
        if (!didFlagChange(normalizedFlagName, normalizedFlagValue)) return;

        const updatedFlags: Flags = {
          [normalizedFlagName]: normalizedFlagValue,
        };

        // NOTE: Adapter state needs to be updated outside of debounced-fn
        // so that no flag updates are lost.
        updateFlagsInAdapterState(updatedFlags);

        const updateFlags = () => {
          onFlagsStateChange(adapterState.flags);
        };

        debounce(updateFlags, {
          wait: flagsUpdateDelayMs,
          immediate: !flagsUpdateDelayMs,
        })();
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
export const normalizeFlags = (rawFlags: Flags): Flags =>
  Object.entries(rawFlags).reduce<Flags>(
    (normalizedFlags: Flags, [flagName, flagValue]) => {
      const [normalizedFlagName, normalizedFlagValue]: Flag = normalizeFlag(
        flagName,
        flagValue
      );
      // Can't return expression as it is the assigned value
      normalizedFlags[normalizedFlagName] = normalizedFlagValue;

      return normalizedFlags;
    },
    {}
  );

const getInitialFlags = ({
  onFlagsStateChange,
  onStatusStateChange,
  flags,
  throwOnInitializationFailure,
}: {
  onFlagsStateChange: OnFlagsStateChangeCallback;
  onStatusStateChange: OnStatusStateChangeCallback;
  flags: Flags;
  throwOnInitializationFailure: boolean;
}): Promise<{ flagsFromSdk: Flags | null }> => {
  if (adapterState.client) {
    return adapterState.client
      .waitForInitialization()
      .then(() => {
        let flagsFromSdk: null | Flags = null;

        if (adapterState.client && !flags) {
          flagsFromSdk = adapterState.client.allFlags();
        } else if (adapterState.client && flags) {
          flagsFromSdk = {};

          for (let [requestedFlagName, defaultFlagValue] of Object.entries(
            flags
          )) {
            const denormalizedRequestedFlagName = denormalizeFlagName(
              requestedFlagName
            );
            flagsFromSdk[
              denormalizedRequestedFlagName
            ] = adapterState.client.variation(
              denormalizedRequestedFlagName,
              defaultFlagValue
            );
          }
        }

        if (flagsFromSdk) {
          const flags: Flags = normalizeFlags(flagsFromSdk);
          updateFlagsInAdapterState(flags);
          // ...and flush initial state of flags
          onFlagsStateChange(flags);
        }

        // First update internal state
        adapterState.isReady = true;
        // ...to then signal that the adapter is ready
        onStatusStateChange({ isReady: true });

        return Promise.resolve({ flagsFromSdk });
      })
      .catch(() => {
        if (throwOnInitializationFailure)
          return Promise.reject(
            new Error(
              '@flopflip/launchdarkly-adapter: adapter failed to initialize.'
            )
          );
        return Promise.resolve({ flagsFromSdk: null });
      });
  }

  return Promise.reject(
    new Error(
      '@flopflip/launchdarkly-adapter: can not subscribe with non initialized client.'
    )
  );
};

const configure = ({
  clientSideId,
  user,
  clientOptions = {},
  onFlagsStateChange,
  onStatusStateChange,
  flags,
  subscribeToFlagChanges = true,
  throwOnInitializationFailure = false,
  flagsUpdateDelayMs,
}: {
  clientSideId: string;
  user: User;
  clientOptions: ClientOptions;
  onFlagsStateChange: OnFlagsStateChangeCallback;
  onStatusStateChange: OnStatusStateChangeCallback;
  flags: Flags;
  subscribeToFlagChanges: boolean;
  throwOnInitializationFailure: boolean;
  flagsUpdateDelayMs?: number;
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
    flags,
    throwOnInitializationFailure,
  }).then(({ flagsFromSdk }) => {
    if (subscribeToFlagChanges && flagsFromSdk)
      setupFlagSubcription({
        flagsFromSdk,
        flagsUpdateDelayMs,
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
