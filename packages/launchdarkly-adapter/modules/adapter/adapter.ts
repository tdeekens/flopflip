import {
  TFlagName,
  TFlagVariation,
  TUser,
  TFlag,
  TFlags,
  TLaunchDarklyAdapterInterface,
  TLaunchDarklyAdapterArgs,
  TAdapterEventHandlers,
  interfaceIdentifiers,
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

type AdapterState = {
  isReady: boolean;
  isConfigured: boolean;
  user?: TUser;
  client?: LDClient;
  flags: TFlags;
};

const adapterState: AdapterState = {
  isReady: false,
  isConfigured: false,
  user: undefined,
  client: undefined,
  flags: {},
};

const updateFlagsInAdapterState = (updatedFlags: TFlags): void => {
  adapterState.flags = {
    ...adapterState.flags,
    ...updatedFlags,
  };
};

const normalizeFlag = (
  flagName: TFlagName,
  flagValue?: TFlagVariation
): TFlag => [
  camelCase(flagName),
  // Multi variate flags contain a string or `null` - `false` seems more natural.
  flagValue === null || flagValue === undefined ? false : flagValue,
];
const denormalizeFlagName = (flagName: TFlagName) => kebabCase(flagName);

const getIsAnonymousUser = (user: TUser): boolean => !user?.key;

const ensureUser = (user: TUser) => {
  const isAnonymousUser = getIsAnonymousUser(user);

  // NOTE: When marked `anonymous` the SDK will generate a unique key and cache it in local storage
  return merge<TUser, LDUser>(user, {
    key: isAnonymousUser ? undefined : user.key,
    anonymous: isAnonymousUser,
  });
};

const initializeClient = (
  clientSideId: TLaunchDarklyAdapterArgs['clientSideId'],
  user: TUser,
  clientOptions: TLaunchDarklyAdapterArgs['clientOptions']
): LDClient =>
  initializeLaunchDarklyClient(clientSideId, user as LDUser, clientOptions);

const changeUserContext = (nextUser: TUser): Promise<any> =>
  adapterState.client && adapterState.client.identify
    ? adapterState.client.identify(nextUser as LDUser)
    : Promise.reject(
        new Error('Can not change user context: client not yet initialized.')
      );

// NOTE: Exported for testing only
export const normalizeFlags = (rawFlags: TFlags): TFlags =>
  Object.entries(rawFlags).reduce<TFlags>(
    (normalizedFlags: TFlags, [flagName, flagValue]) => {
      const [normalizedFlagName, normalizedFlagValue]: TFlag = normalizeFlag(
        flagName,
        flagValue
      );
      // Can't return expression as it is the assigned value
      normalizedFlags[normalizedFlagName] = normalizedFlagValue;

      return normalizedFlags;
    },
    {}
  );

const getInitialFlags = (
  {
    flags,
    throwOnInitializationFailure,
  }: Pick<TLaunchDarklyAdapterArgs, 'flags' | 'throwOnInitializationFailure'>,
  adapterEventHandlers: TAdapterEventHandlers
): Promise<{ flagsFromSdk: TFlags | null }> => {
  if (adapterState.client) {
    return adapterState.client
      .waitForInitialization()
      .then(() => {
        let flagsFromSdk: null | TFlags = null;

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
          const flags: TFlags = normalizeFlags(flagsFromSdk);
          updateFlagsInAdapterState(flags);
          // ...and flush initial state of flags
          adapterEventHandlers.onFlagsStateChange(flags);
        }

        // First update internal state
        adapterState.isReady = true;
        // ...to then signal that the adapter is ready
        adapterEventHandlers.onStatusStateChange({ isReady: true });

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

class LaunchDarklyAdapter implements TLaunchDarklyAdapterInterface {
  id: typeof interfaceIdentifiers.launchdarkly;

  constructor() {
    this.id = interfaceIdentifiers.launchdarkly;
  }

  configure(
    adapterArgs: TLaunchDarklyAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ): Promise<any> {
    const {
      clientSideId,
      user,
      clientOptions = {},
      flags,
      subscribeToFlagChanges = true,
      throwOnInitializationFailure = false,
      flagsUpdateDelayMs,
    } = adapterArgs;

    adapterState.user = ensureUser(user);
    adapterState.client = initializeClient(
      clientSideId,
      adapterState.user,
      clientOptions
    );
    adapterState.isConfigured = true;

    return getInitialFlags(
      {
        flags,
        throwOnInitializationFailure,
      },
      adapterEventHandlers
    ).then(({ flagsFromSdk }) => {
      if (subscribeToFlagChanges && flagsFromSdk)
        this._setupFlagSubcription(
          {
            flagsFromSdk,
            flagsUpdateDelayMs,
          },
          adapterEventHandlers
        );

      return adapterState.client;
    });
  }

  reconfigure(
    adapterArgs: TLaunchDarklyAdapterArgs,
    _adapterEventHandlers: TAdapterEventHandlers
  ): Promise<any> {
    if (!adapterState.isConfigured)
      return Promise.reject(
        new Error(
          '@flopflip/launchdarkly-adapter: please configure adapter before reconfiguring.'
        )
      );
    const nextUser = adapterArgs.user;
    if (!isEqual(adapterState.user, nextUser)) {
      adapterState.user = ensureUser(nextUser);

      return changeUserContext(adapterState.user);
    }

    return Promise.resolve();
  }

  getIsReady(): boolean {
    return adapterState.isReady;
  }

  getClient(): LDClient | undefined {
    return adapterState.client;
  }

  getFlag(flagName: TFlagName): TFlagVariation | undefined {
    return adapterState.flags[flagName];
  }

  updateUserContext(updatedUserProps: TUser): Promise<any> {
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
  }

  private _didFlagChange(flagName: TFlagName, nextFlagValue: TFlagVariation) {
    const previousFlagValue = this.getFlag(flagName);

    if (previousFlagValue === undefined) return true;

    return previousFlagValue !== nextFlagValue;
  }

  private _setupFlagSubcription(
    {
      flagsFromSdk,
      flagsUpdateDelayMs,
    }: {
      flagsFromSdk: TFlags;
      flagsUpdateDelayMs?: number;
    },
    adapterEventHandlers: TAdapterEventHandlers
  ): void {
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
          if (!this._didFlagChange(normalizedFlagName, normalizedFlagValue))
            return;

          const updatedFlags: TFlags = {
            [normalizedFlagName]: normalizedFlagValue,
          };

          // NOTE: Adapter state needs to be updated outside of debounced-fn
          // so that no flag updates are lost.
          updateFlagsInAdapterState(updatedFlags);

          const updateFlags = () => {
            adapterEventHandlers.onFlagsStateChange(adapterState.flags);
          };

          debounce(updateFlags, {
            wait: flagsUpdateDelayMs,
            immediate: !flagsUpdateDelayMs,
          })();
        });
      }
    }
  }
}

const adapter = new LaunchDarklyAdapter();
export default adapter;
