import type { DeepReadonly } from 'ts-essentials';
import type {
  TFlagName,
  TFlagVariation,
  TAdapterStatus,
  TUser,
  TFlag,
  TFlags,
  TLaunchDarklyAdapterArgs,
  TUpdateFlagsOptions,
  TAdapterEventHandlers,
  TFlagsUpdateFunction,
  TAdapterStatusChange,
  TFlagsChange,
  TLaunchDarklyAdapterInterface,
} from '@flopflip/types';
import {
  AdapterInitializationStatus,
  AdapterConfigurationStatus,
  AdapterSubscriptionStatus,
  interfaceIdentifiers,
} from '@flopflip/types';

import merge from 'deepmerge';
import warning from 'tiny-warning';
import isEqual from 'lodash/isEqual';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import debounce from 'debounce-fn';
import getGlobalThis from 'globalthis';

import mitt, { Emitter } from 'mitt';
import {
  initialize as initializeLaunchDarklyClient,
  LDUser,
  LDClient,
} from 'launchdarkly-js-client-sdk';

type LaunchDarklyAdapterState = {
  user?: TUser;
  client?: LDClient;
  flags: TFlags;
  emitter: Emitter;
  lockedFlags: Set<TFlagName>;
  unsubscribedFlags: Set<TFlagName>;
};

const adapterState: TAdapterStatus & LaunchDarklyAdapterState = {
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
  user: undefined,
  client: undefined,
  flags: {},
  // Typings are incorrect and state that mitt is not callable.
  // Value of type 'MittStatic' is not callable. Did you mean to include 'new'
  emitter: mitt(),
  lockedFlags: new Set<TFlagName>(),
  unsubscribedFlags: new Set<TFlagName>(),
};

// Internal
const updateFlagsInAdapterState = (
  flags: Readonly<TFlags>,
  options?: TUpdateFlagsOptions
): void => {
  const updatedFlags = Object.entries(flags).reduce(
    (updatedFlags, [flagName, flagValue]) => {
      if (getIsFlagLocked(flagName)) return updatedFlags;

      if (options?.lockFlags) {
        adapterState.lockedFlags.add(flagName);
      }

      if (options?.unsubscribeFlags) {
        adapterState.unsubscribedFlags.add(flagName);
      }

      updatedFlags = {
        ...updatedFlags,
        [flagName]: flagValue,
      };

      return updatedFlags;
    },
    {}
  );

  adapterState.flags = {
    ...adapterState.flags,
    ...updatedFlags,
  };
};

// External. Flags are autolocked when updated.
const updateFlags: TFlagsUpdateFunction = (flags, options) => {
  updateFlagsInAdapterState(flags, options);

  // ...and flush initial state of flags
  if (!getIsAdapterUnsubscribed()) {
    adapterState.emitter.emit('flagsStateChange', adapterState.flags);
  }
};

const getIsAdapterUnsubscribed = () =>
  adapterState.subscriptionStatus === AdapterSubscriptionStatus.Unsubscribed;

const getIsFlagUnsubcribed = (flagName: TFlagName) =>
  adapterState.unsubscribedFlags.has(flagName);
const getIsFlagLocked = (flagName: TFlagName) =>
  adapterState.lockedFlags.has(flagName);

const withoutUnsubscribedOrLockedFlags = (flags: TFlags) =>
  Object.fromEntries(
    Object.entries(flags).filter(
      ([flagName]) =>
        !getIsFlagUnsubcribed(flagName) && !getIsFlagLocked(flagName)
    )
  );

const normalizeFlag = (
  flagName: TFlagName,
  flagValue?: TFlagVariation
): TFlag => [
  camelCase(flagName),
  // Multi variate flags contain a string or `null` - `false` seems more natural.
  flagValue === null || flagValue === undefined ? false : flagValue,
];
const denormalizeFlagName = (flagName: TFlagName) => kebabCase(flagName);

const getIsAnonymousUser = (user: Readonly<TUser>) => !user?.key;

const ensureUser = (user: Readonly<TUser>) => {
  const isAnonymousUser = getIsAnonymousUser(user);

  // NOTE: When marked `anonymous` the SDK will generate a unique key and cache it in local storage
  return merge<TUser, LDUser>(user, {
    key: isAnonymousUser ? undefined : user.key,
    anonymous: isAnonymousUser,
  });
};

const initializeClient = (
  clientSideId: TLaunchDarklyAdapterArgs['clientSideId'],
  user: Readonly<TUser>,
  clientOptions: TLaunchDarklyAdapterArgs['clientOptions']
) => initializeLaunchDarklyClient(clientSideId, user as LDUser, clientOptions);

const changeUserContext = async (nextUser: Readonly<TUser>) =>
  adapterState.client?.identify
    ? adapterState.client.identify(nextUser as LDUser)
    : Promise.reject(
        new Error('Can not change user context: client not yet initialized.')
      );

const normalizeFlags = (
  rawFlags: Readonly<TFlags>
): Record<string, TFlagVariation> =>
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

const getInitialFlags = async ({
  flags,
  throwOnInitializationFailure,
}: DeepReadonly<
  Pick<TLaunchDarklyAdapterArgs, 'flags' | 'throwOnInitializationFailure'>
>): Promise<
  DeepReadonly<{
    flagsFromSdk: TFlags | null;
    initializationStatus: AdapterInitializationStatus;
  }>
> => {
  if (adapterState.client) {
    return adapterState.client
      .waitForInitialization()
      .then(async () => {
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
          const normalizedFlags = normalizeFlags(flagsFromSdk);
          const flags = withoutUnsubscribedOrLockedFlags(normalizedFlags);

          updateFlags(flags);
        }

        // First update internal state
        adapterState.configurationStatus =
          AdapterConfigurationStatus.Configured;

        // ...to then signal that the adapter is configured
        if (!getIsAdapterUnsubscribed()) {
          adapterState.emitter.emit('statusStateChange', {
            configurationStatus: adapterState.configurationStatus,
          });
        }

        return Promise.resolve({
          flagsFromSdk,
          initializationStatus: AdapterInitializationStatus.Succeeded,
        });
      })
      .catch(async () => {
        if (throwOnInitializationFailure)
          return Promise.reject(
            new Error(
              '@flopflip/launchdarkly-adapter: adapter failed to initialize.'
            )
          );

        console.warn(
          '@flopflip/launchdarkly-adapter: adapter failed to initialize.'
        );

        return Promise.resolve({
          flagsFromSdk: null,
          initializationStatus: AdapterInitializationStatus.Failed,
        });
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

  async configure(
    adapterArgs: DeepReadonly<TLaunchDarklyAdapterArgs>,
    adapterEventHandlers: DeepReadonly<TAdapterEventHandlers>
  ) {
    adapterState.configurationStatus = AdapterConfigurationStatus.Configuring;

    adapterState.emitter.on<TFlagsChange>(
      'flagsStateChange',
      // @ts-expect-error
      adapterEventHandlers.onFlagsStateChange
    );
    adapterState.emitter.on<TAdapterStatusChange>(
      'statusStateChange',
      // @ts-expect-error
      adapterEventHandlers.onStatusStateChange
    );

    adapterState.emitter.emit('statusStateChange', {
      configurationStatus: adapterState.configurationStatus,
    });

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

    return getInitialFlags({
      flags,
      throwOnInitializationFailure,
    }).then(({ flagsFromSdk, initializationStatus }) => {
      if (subscribeToFlagChanges && flagsFromSdk)
        this._setupFlagSubcription({
          flagsFromSdk,
          flagsUpdateDelayMs,
        });

      return { initializationStatus };
    });
  }

  async reconfigure(
    adapterArgs: DeepReadonly<TLaunchDarklyAdapterArgs>,
    _adapterEventHandlers: DeepReadonly<TAdapterEventHandlers>
  ) {
    if (
      adapterState.configurationStatus !== AdapterConfigurationStatus.Configured
    )
      return Promise.reject(
        new Error(
          '@flopflip/launchdarkly-adapter: please configure adapter before reconfiguring.'
        )
      );

    const nextUser = adapterArgs.user;

    if (!isEqual(adapterState.user, nextUser)) {
      adapterState.user = ensureUser(nextUser);

      await changeUserContext(adapterState.user);

      return Promise.resolve({
        initializationStatus: AdapterInitializationStatus.Succeeded,
      });
    }

    return Promise.resolve({
      initializationStatus: AdapterInitializationStatus.Succeeded,
    });
  }

  getIsConfigurationStatus(configurationStatus: AdapterConfigurationStatus) {
    return adapterState.configurationStatus === configurationStatus;
  }

  getClient() {
    return adapterState.client;
  }

  getFlag(flagName: TFlagName): TFlagVariation {
    return adapterState.flags[flagName];
  }

  async updateUserContext(updatedUserProps: Readonly<TUser>) {
    const isAdapterConfigured =
      adapterState.configurationStatus ===
      AdapterConfigurationStatus.Configured;

    warning(
      isAdapterConfigured,
      '@flopflip/launchdarkly-adapter: adapter not configured. User context can not be updated before.'
    );

    if (!isAdapterConfigured)
      return Promise.reject(
        new Error('Can not update user context: adapter not yet configured.')
      );

    return changeUserContext({ ...adapterState.user, ...updatedUserProps });
  }

  unsubscribe() {
    adapterState.subscriptionStatus = AdapterSubscriptionStatus.Unsubscribed;
  }

  subscribe() {
    adapterState.subscriptionStatus = AdapterSubscriptionStatus.Subscribed;
  }

  // NOTE: This function is deprecated. Please use `getIsConfigurationStatus`.
  getIsReady() {
    warning(
      false,
      '@flopflip/launchdarkly-adapter: `getIsReady` has been deprecated. Please use `getIsConfigurationStatus` instead.'
    );

    return this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured);
  }

  private _didFlagChange(flagName: TFlagName, nextFlagValue: TFlagVariation) {
    const previousFlagValue = this.getFlag(flagName);

    if (previousFlagValue === undefined) return true;

    return previousFlagValue !== nextFlagValue;
  }

  private _setupFlagSubcription({
    flagsFromSdk,
    flagsUpdateDelayMs,
  }: DeepReadonly<{
    flagsFromSdk: TFlags;
    flagsUpdateDelayMs?: number;
  }>) {
    for (const flagName in flagsFromSdk) {
      // Dispatch whenever a configured flag value changes
      if (
        Object.prototype.hasOwnProperty.call(flagsFromSdk, flagName) &&
        adapterState.client
      ) {
        adapterState.client.on(`change:${flagName}`, (flagValue) => {
          const [normalizedFlagName, normalizedFlagValue] = normalizeFlag(
            flagName,
            flagValue
          );

          if (getIsFlagUnsubcribed(normalizedFlagName)) return;

          // Sometimes the SDK flushes flag changes without a value having changed.
          if (!this._didFlagChange(normalizedFlagName, normalizedFlagValue))
            return;

          const updatedFlags: TFlags = {
            [normalizedFlagName]: normalizedFlagValue,
          };

          // NOTE: Adapter state needs to be updated outside of debounced-fn
          // so that no flag updates are lost.
          updateFlagsInAdapterState(updatedFlags);

          const flushFlagsUpdate = () => {
            if (!getIsAdapterUnsubscribed()) {
              adapterState.emitter.emit('flagsStateChange', adapterState.flags);
            }
          };

          const scheduleImmediately = { before: true, after: false };
          const scheduleTrailingEdge = { before: false, after: true };

          debounce(flushFlagsUpdate, {
            wait: flagsUpdateDelayMs,
            ...(flagsUpdateDelayMs
              ? scheduleTrailingEdge
              : scheduleImmediately),
          })();
        });
      }
    }
  }
}

const adapter = new LaunchDarklyAdapter();

const exposeGlobally = () => {
  const globalThis = getGlobalThis();

  if (!globalThis.__flopflip__) {
    globalThis.__flopflip__ = {};
  }

  globalThis.__flopflip__.launchdarkly = {
    adapter,
    updateFlags,
  };
};

exposeGlobally();

export default adapter;
export { updateFlags, normalizeFlag, normalizeFlags };
