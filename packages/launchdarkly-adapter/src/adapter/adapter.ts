import type {
  TFlagName,
  TFlagVariation,
  TAdapterStatus,
  TUser,
  TFlags,
  TLaunchDarklyAdapterArgs,
  TUpdateFlagsOptions,
  TAdapterEventHandlers,
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

class LaunchDarklyAdapter implements TLaunchDarklyAdapterInterface {
  #adapterState: TAdapterStatus & LaunchDarklyAdapterState;
  id: typeof interfaceIdentifiers.launchdarkly;

  constructor() {
    this.#adapterState = {
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
          this.#adapterState.lockedFlags.add(flagName);
        }

        if (options?.unsubscribeFlags) {
          this.#adapterState.unsubscribedFlags.add(flagName);
        }

        updatedFlags = {
          ...updatedFlags,
          [flagName]: flagValue,
        };

        return updatedFlags;
      },
      {}
    );

    this.#adapterState.flags = {
      ...this.#adapterState.flags,
      ...updatedFlags,
    };
  };

  #getIsAdapterUnsubscribed = () =>
    this.#adapterState.subscriptionStatus ===
    AdapterSubscriptionStatus.Unsubscribed;

  #getIsFlagUnsubcribed = (flagName: TFlagName) =>
    this.#adapterState.unsubscribedFlags.has(flagName);

  #getIsFlagLocked = (flagName: TFlagName) =>
    this.#adapterState.lockedFlags.has(flagName);

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
    this.#adapterState.client?.identify
      ? this.#adapterState.client.identify(nextUser as LDUser)
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
    if (this.#adapterState.client) {
      return this.#adapterState.client
        .waitForInitialization()
        .then(async () => {
          let flagsFromSdk: null | TFlags = null;

          if (this.#adapterState.client && !flags) {
            flagsFromSdk = this.#adapterState.client.allFlags();
          } else if (this.#adapterState.client && flags) {
            flagsFromSdk = {};

            for (let [requestedFlagName, defaultFlagValue] of Object.entries(
              flags
            )) {
              const denormalizedRequestedFlagName = denormalizeFlagName(
                requestedFlagName
              );
              flagsFromSdk[
                denormalizedRequestedFlagName
              ] = this.#adapterState.client.variation(
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
          this.#adapterState.configurationStatus =
            AdapterConfigurationStatus.Configured;

          // ...to then signal that the adapter is configured
          if (!this.#getIsAdapterUnsubscribed()) {
            this.#adapterState.emitter.emit('statusStateChange', {
              configurationStatus: this.#adapterState.configurationStatus,
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

  #didFlagChange = (flagName: TFlagName, nextFlagValue: TFlagVariation) => {
    const previousFlagValue = this.getFlag(flagName);

    if (previousFlagValue === undefined) return true;

    return previousFlagValue !== nextFlagValue;
  };

  #setupFlagSubcription = ({
    flagsFromSdk,
    flagsUpdateDelayMs,
  }: {
    flagsFromSdk: TFlags;
    flagsUpdateDelayMs?: number;
  }) => {
    for (const flagName in flagsFromSdk) {
      // Dispatch whenever a configured flag value changes
      if (
        Object.prototype.hasOwnProperty.call(flagsFromSdk, flagName) &&
        this.#adapterState.client
      ) {
        this.#adapterState.client.on(`change:${flagName}`, (flagValue) => {
          const [normalizedFlagName, normalizedFlagValue] = normalizeFlag(
            flagName,
            flagValue
          );

          if (this.#getIsFlagUnsubcribed(normalizedFlagName)) return;

          // Sometimes the SDK flushes flag changes without a value having changed.
          if (!this.#didFlagChange(normalizedFlagName, normalizedFlagValue))
            return;

          const updatedFlags: TFlags = {
            [normalizedFlagName]: normalizedFlagValue,
          };

          // NOTE: Adapter state needs to be updated outside of debounced-fn
          // so that no flag updates are lost.
          this.#updateFlagsInAdapterState(updatedFlags);

          const flushFlagsUpdate = () => {
            if (!this.#getIsAdapterUnsubscribed()) {
              this.#adapterState.emitter.emit(
                'flagsStateChange',
                this.#adapterState.flags
              );
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
  };

  // External. Flags are autolocked when updated.
  updateFlags(flags: TFlags, options?: TUpdateFlagsOptions) {
    this.#updateFlagsInAdapterState(flags, options);

    // ...and flush initial state of flags
    if (!this.#getIsAdapterUnsubscribed()) {
      this.#adapterState.emitter.emit(
        'flagsStateChange',
        this.#adapterState.flags
      );
    }
  }

  async configure(
    adapterArgs: TLaunchDarklyAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) {
    this.#adapterState.configurationStatus =
      AdapterConfigurationStatus.Configuring;

    this.#adapterState.emitter.on<TFlagsChange>(
      'flagsStateChange',
      // @ts-expect-error
      adapterEventHandlers.onFlagsStateChange
    );
    this.#adapterState.emitter.on<TAdapterStatusChange>(
      'statusStateChange',
      // @ts-expect-error
      adapterEventHandlers.onStatusStateChange
    );

    this.#adapterState.emitter.emit('statusStateChange', {
      configurationStatus: this.#adapterState.configurationStatus,
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

    this.#adapterState.user = this.#ensureUser(user);
    this.#adapterState.client = this.#initializeClient(
      clientSideId,
      this.#adapterState.user,
      clientOptions
    );

    return this.#getInitialFlags({
      flags,
      throwOnInitializationFailure,
    }).then(({ flagsFromSdk, initializationStatus }) => {
      if (subscribeToFlagChanges && flagsFromSdk)
        this.#setupFlagSubcription({
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
      this.#adapterState.configurationStatus !==
      AdapterConfigurationStatus.Configured
    )
      return Promise.reject(
        new Error(
          '@flopflip/launchdarkly-adapter: please configure adapter before reconfiguring.'
        )
      );

    const nextUser = adapterArgs.user;

    if (!isEqual(this.#adapterState.user, nextUser)) {
      this.#adapterState.user = this.#ensureUser(nextUser);

      await this.#changeUserContext(this.#adapterState.user);

      return Promise.resolve({
        initializationStatus: AdapterInitializationStatus.Succeeded,
      });
    }

    return Promise.resolve({
      initializationStatus: AdapterInitializationStatus.Succeeded,
    });
  }

  getIsConfigurationStatus(configurationStatus: AdapterConfigurationStatus) {
    return this.#adapterState.configurationStatus === configurationStatus;
  }

  getClient() {
    return this.#adapterState.client;
  }

  getFlag(flagName: TFlagName): TFlagVariation {
    return this.#adapterState.flags[flagName];
  }

  async updateUserContext(updatedUserProps: TUser) {
    const isAdapterConfigured =
      this.#adapterState.configurationStatus ===
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
      ...this.#adapterState.user,
      ...updatedUserProps,
    });
  }

  unsubscribe() {
    this.#adapterState.subscriptionStatus =
      AdapterSubscriptionStatus.Unsubscribed;
  }

  subscribe() {
    this.#adapterState.subscriptionStatus =
      AdapterSubscriptionStatus.Subscribed;
  }

  // NOTE: This function is deprecated. Please use `getIsConfigurationStatus`.
  getIsReady() {
    warning(
      false,
      '@flopflip/launchdarkly-adapter: `getIsReady` has been deprecated. Please use `getIsConfigurationStatus` instead.'
    );

    return this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured);
  }
}

const adapter = new LaunchDarklyAdapter();

exposeGlobally(adapter, adapter.updateFlags);

const updateFlags = adapter.updateFlags;

export default adapter;
export { updateFlags };
