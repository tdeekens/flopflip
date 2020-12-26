import type {
  TFlagName,
  TFlagVariation,
  TAdapterStatus,
  TUser,
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
import {
  normalizeFlags,
  normalizeFlag,
  denormalizeFlagName,
  exposeGlobally,
} from '@flopflip/adapter-utilities';

import merge from 'deepmerge';
import warning from 'tiny-warning';
import isEqual from 'lodash/isEqual';
import debounce from 'debounce-fn';
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

class LaunchDarklyAdapter implements TLaunchDarklyAdapterInterface {
  id: typeof interfaceIdentifiers.launchdarkly;

  constructor() {
    this.id = interfaceIdentifiers.launchdarkly;
  }

  #updateFlagsInAdapterState = (
    flags: TFlags,
    options?: TUpdateFlagsOptions
  ): void => {
    const updatedFlags = Object.entries(flags).reduce(
      (updatedFlags, [flagName, flagValue]) => {
        if (this.#getIsFlagLocked(flagName)) return updatedFlags;

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

  #getIsAdapterUnsubscribed = () =>
    adapterState.subscriptionStatus === AdapterSubscriptionStatus.Unsubscribed;

  #getIsFlagUnsubcribed = (flagName: TFlagName) =>
    adapterState.unsubscribedFlags.has(flagName);

  #getIsFlagLocked = (flagName: TFlagName) =>
    adapterState.lockedFlags.has(flagName);

  #withoutUnsubscribedOrLockedFlags = (flags: TFlags) =>
    Object.fromEntries(
      Object.entries(flags).filter(
        ([flagName]) =>
          !this.#getIsFlagUnsubcribed(flagName) &&
          !this.#getIsFlagLocked(flagName)
      )
    );

  #getIsAnonymousUser = (user: TUser) => !user?.key;

  #ensureUser = (user: TUser) => {
    const isAnonymousUser = this.#getIsAnonymousUser(user);

    // NOTE: When marked `anonymous` the SDK will generate a unique key and cache it in local storage
    return merge<TUser, LDUser>(user, {
      key: isAnonymousUser ? undefined : user.key,
      anonymous: isAnonymousUser,
    });
  };

  #initializeClient = (
    clientSideId: TLaunchDarklyAdapterArgs['clientSideId'],
    user: TUser,
    clientOptions: TLaunchDarklyAdapterArgs['clientOptions']
  ) =>
    initializeLaunchDarklyClient(clientSideId, user as LDUser, clientOptions);

  #changeUserContext = async (nextUser: TUser) =>
    adapterState.client?.identify
      ? adapterState.client.identify(nextUser as LDUser)
      : Promise.reject(
          new Error('Can not change user context: client not yet initialized.')
        );

  #getInitialFlags = async ({
    flags,
    throwOnInitializationFailure,
  }: Pick<
    TLaunchDarklyAdapterArgs,
    'flags' | 'throwOnInitializationFailure'
  >): Promise<{
    flagsFromSdk: TFlags | null;
    initializationStatus: AdapterInitializationStatus;
  }> => {
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
            const flags = this.#withoutUnsubscribedOrLockedFlags(
              normalizedFlags
            );

            this.updateFlags(flags);
          }

          // First update internal state
          adapterState.configurationStatus =
            AdapterConfigurationStatus.Configured;

          // ...to then signal that the adapter is configured
          if (!this.#getIsAdapterUnsubscribed()) {
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

  // External. Flags are autolocked when updated.
  updateFlags: TFlagsUpdateFunction = (flags, options) => {
    this.#updateFlagsInAdapterState(flags, options);

    // ...and flush initial state of flags
    if (!this.#getIsAdapterUnsubscribed()) {
      adapterState.emitter.emit('flagsStateChange', adapterState.flags);
    }
  };

  async configure(
    adapterArgs: TLaunchDarklyAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
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

    adapterState.user = this.#ensureUser(user);
    adapterState.client = this.#initializeClient(
      clientSideId,
      adapterState.user,
      clientOptions
    );

    return this.#getInitialFlags({
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
    adapterArgs: TLaunchDarklyAdapterArgs,
    _adapterEventHandlers: TAdapterEventHandlers
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
      adapterState.user = this.#ensureUser(nextUser);

      await this.#changeUserContext(adapterState.user);

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

  async updateUserContext(updatedUserProps: TUser) {
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

    return this.#changeUserContext({
      ...adapterState.user,
      ...updatedUserProps,
    });
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
  }: {
    flagsFromSdk: TFlags;
    flagsUpdateDelayMs?: number;
  }) {
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

          if (this.#getIsFlagUnsubcribed(normalizedFlagName)) return;

          // Sometimes the SDK flushes flag changes without a value having changed.
          if (!this._didFlagChange(normalizedFlagName, normalizedFlagValue))
            return;

          const updatedFlags: TFlags = {
            [normalizedFlagName]: normalizedFlagValue,
          };

          // NOTE: Adapter state needs to be updated outside of debounced-fn
          // so that no flag updates are lost.
          this.#updateFlagsInAdapterState(updatedFlags);

          const flushFlagsUpdate = () => {
            if (!this.#getIsAdapterUnsubscribed()) {
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

exposeGlobally(adapter, adapter.updateFlags);

const updateFlags = adapter.updateFlags;

export default adapter;
export { updateFlags };
