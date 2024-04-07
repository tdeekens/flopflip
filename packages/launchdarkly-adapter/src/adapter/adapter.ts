import {
  denormalizeFlagName,
  exposeGlobally,
  normalizeFlag,
  normalizeFlags,
} from '@flopflip/adapter-utilities';
import { getCache } from '@flopflip/cache';
import {
  AdapterConfigurationStatus,
  adapterIdentifiers,
  AdapterInitializationStatus,
  AdapterSubscriptionStatus,
  type TAdapterEventHandlers,
  type TAdapterStatus,
  type TAdapterStatusChange,
  type TCacheIdentifiers,
  type TCacheMode,
  type TFlagName,
  type TFlags,
  type TFlagsChange,
  type TFlagVariation,
  type TLaunchDarklyAdapterArgs,
  type TLaunchDarklyAdapterInterface,
  type TUpdateFlagsOptions,
} from '@flopflip/types';
import debounce from 'debounce-fn';
import {
  initialize as initializeLaunchDarklyClient,
  type LDClient,
  type LDContext,
} from 'launchdarkly-js-client-sdk';
import isEqual from 'lodash/isEqual';
import mitt, { type Emitter } from 'mitt';
import warning from 'tiny-warning';
import { merge } from 'ts-deepmerge';

type TEmitterEvents = {
  flagsStateChange: TFlags;
  statusStateChange: Partial<TAdapterStatus>;
};

type TLaunchDarklyAdapterState = {
  context?: LDContext;
  client?: LDClient;
  flags: TFlags;
  emitter: Emitter<TEmitterEvents>;
  lockedFlags: Set<TFlagName>;
  unsubscribedFlags: Set<TFlagName>;
};

class LaunchDarklyAdapter implements TLaunchDarklyAdapterInterface {
  id: typeof adapterIdentifiers.launchdarkly;

  readonly #adapterState: TAdapterStatus & TLaunchDarklyAdapterState;

  constructor() {
    this.#adapterState = {
      subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
      configurationStatus: AdapterConfigurationStatus.Unconfigured,
      context: undefined,
      client: undefined,
      flags: {},
      // Typings are incorrect and state that mitt is not callable.
      // Value of type 'MittStatic' is not callable. Did you mean to include 'new'
      emitter: mitt(),
      lockedFlags: new Set<TFlagName>(),
      unsubscribedFlags: new Set<TFlagName>(),
    };
    this.id = adapterIdentifiers.launchdarkly;
  }

  readonly #updateFlagsInAdapterState = (
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

  readonly #getIsAdapterUnsubscribed = () =>
    this.#adapterState.subscriptionStatus ===
    AdapterSubscriptionStatus.Unsubscribed;

  readonly #getIsFlagUnsubcribed = (flagName: TFlagName) =>
    this.#adapterState.unsubscribedFlags.has(flagName);

  readonly #getIsFlagLocked = (flagName: TFlagName) =>
    this.#adapterState.lockedFlags.has(flagName);

  readonly #withoutUnsubscribedOrLockedFlags = (flags: TFlags) =>
    Object.fromEntries(
      Object.entries(flags).filter(
        ([flagName]) =>
          !this.#getIsFlagUnsubcribed(flagName) &&
          !this.#getIsFlagLocked(flagName)
      )
    );

  readonly #getIsAnonymousContext = (context: LDContext) => !context?.key;

  readonly #ensureContext = (context: LDContext) => {
    const isAnonymousContext = this.#getIsAnonymousContext(context);

    // NOTE: When marked `anonymous` the SDK will generate a unique key and cache it in local storage
    return merge(context, {
      key: isAnonymousContext ? undefined : context.key,
      anonymous: isAnonymousContext,
    });
  };

  readonly #initializeClient = (
    clientSideId: TLaunchDarklyAdapterArgs['sdk']['clientSideId'],
    context: LDContext,
    options: TLaunchDarklyAdapterArgs['sdk']['clientOptions']
  ) => initializeLaunchDarklyClient(clientSideId, context, options);

  readonly #changeClientContext = async (nextContext: LDContext) =>
    this.#adapterState.client?.identify
      ? this.#adapterState.client.identify(nextContext)
      : Promise.reject(
          new Error('Can not change user context: client not yet initialized.')
        );

  readonly #maybeUpdateFlagsInCache = async (
    flagsToCache: TFlags,
    cacheIdentifier?: TCacheIdentifiers
  ) => {
    if (cacheIdentifier) {
      const cache = await getCache(
        cacheIdentifier,
        adapterIdentifiers.launchdarkly,
        // NOTE: LDContextCommon is part of the type which we never use.
        this.#adapterState.context?.key as string
      );

      const cachedFlags: TFlags = cache.get();

      cache.set({ ...cachedFlags, ...flagsToCache });
    }
  };

  readonly #getInitialFlags = async ({
    flags,
    throwOnInitializationFailure,
    cacheIdentifier,
  }: Pick<
    TLaunchDarklyAdapterArgs,
    'flags' | 'throwOnInitializationFailure' | 'cacheIdentifier'
  >): Promise<{
    flagsFromSdk?: TFlags;
    initializationStatus: AdapterInitializationStatus;
  }> => {
    if (this.#adapterState.client) {
      return this.#adapterState.client
        .waitForInitialization()
        .then(async () => {
          let flagsFromSdk: TFlags | undefined;

          if (this.#adapterState.client && !flags) {
            flagsFromSdk = this.#adapterState.client.allFlags();
          } else if (this.#adapterState.client && flags) {
            flagsFromSdk = {};

            for (const [requestedFlagName, defaultFlagValue] of Object.entries(
              flags
            )) {
              const denormalizedRequestedFlagName =
                denormalizeFlagName(requestedFlagName);
              flagsFromSdk[denormalizedRequestedFlagName] =
                this.#adapterState.client.variation(
                  denormalizedRequestedFlagName,
                  defaultFlagValue
                );
            }
          }

          if (flagsFromSdk) {
            const normalizedFlags = normalizeFlags(flagsFromSdk);

            await this.#maybeUpdateFlagsInCache(
              normalizedFlags,
              cacheIdentifier
            );

            const flags =
              this.#withoutUnsubscribedOrLockedFlags(normalizedFlags);

            this.updateFlags(flags);
          }

          this.setConfigurationStatus(AdapterConfigurationStatus.Configured);

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
            flagsFromSdk: undefined,
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

  readonly #didFlagChange = (
    flagName: TFlagName,
    nextFlagValue: TFlagVariation
  ) => {
    const previousFlagValue = this.getFlag(flagName);

    if (previousFlagValue === undefined) return true;

    return previousFlagValue !== nextFlagValue;
  };

  readonly #setupFlagSubcription = ({
    flagsFromSdk,
    flagsUpdateDelayMs,
    cacheIdentifier,
    cacheMode,
  }: {
    flagsFromSdk: TFlags;
    flagsUpdateDelayMs?: number;
    cacheIdentifier?: TCacheIdentifiers;
    cacheMode?: TCacheMode;
  }) => {
    for (const flagName in flagsFromSdk) {
      // Dispatch whenever a configured flag value changes
      if (Object.hasOwn(flagsFromSdk, flagName) && this.#adapterState.client) {
        this.#adapterState.client.on(
          `change:${flagName}`,
          async (flagValue) => {
            const [normalizedFlagName, normalizedFlagValue] = normalizeFlag(
              flagName,
              flagValue as TFlagVariation
            );

            await this.#maybeUpdateFlagsInCache(
              {
                [normalizedFlagName]: normalizedFlagValue,
              },
              cacheIdentifier
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
              if (cacheMode === 'lazy') {
                return;
              }

              this.#adapterState.emitter.emit(
                'flagsStateChange',
                this.#adapterState.flags
              );
            };

            const scheduleImmediately = { before: true, after: false };
            const scheduleTrailingEdge = { before: false, after: true };

            debounce(flushFlagsUpdate, {
              wait: flagsUpdateDelayMs,
              ...(flagsUpdateDelayMs
                ? scheduleTrailingEdge
                : scheduleImmediately),
            })();
          }
        );
      }
    }
  };

  // External. Flags are autolocked when updated.
  updateFlags = (flags: TFlags, options?: TUpdateFlagsOptions) => {
    this.#updateFlagsInAdapterState(flags, options);

    // ...and flush initial state of flags
    this.#adapterState.emitter.emit(
      'flagsStateChange',
      this.#adapterState.flags
    );
  };

  async configure(
    adapterArgs: TLaunchDarklyAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) {
    const handleFlagsChange = (nextFlags: TFlagsChange['flags']) => {
      if (this.#getIsAdapterUnsubscribed()) return;

      adapterEventHandlers.onFlagsStateChange({
        flags: nextFlags,
        id: this.id,
      });
    };

    const handleStatusChange = (nextStatus: TAdapterStatusChange['status']) => {
      if (this.#getIsAdapterUnsubscribed()) return;

      adapterEventHandlers.onStatusStateChange({
        status: nextStatus,
        id: this.id,
      });
    };

    this.#adapterState.configurationStatus =
      AdapterConfigurationStatus.Configuring;

    this.#adapterState.emitter.on('flagsStateChange', handleFlagsChange);
    this.#adapterState.emitter.on('statusStateChange', handleStatusChange);

    this.#adapterState.emitter.emit('statusStateChange', {
      configurationStatus: this.#adapterState.configurationStatus,
    });

    const {
      sdk,
      context,
      flags,
      throwOnInitializationFailure = false,
      flagsUpdateDelayMs,
    } = adapterArgs;
    let cachedFlags: TFlags;

    this.#adapterState.context = this.#ensureContext(context);

    if (adapterArgs.cacheIdentifier) {
      const cache = await getCache(
        adapterArgs.cacheIdentifier,
        adapterIdentifiers.launchdarkly,
        context.key as string
      );

      cachedFlags = cache.get();

      if (cachedFlags) {
        this.#updateFlagsInAdapterState(cachedFlags);
        this.#adapterState.flags = cachedFlags;
        this.#adapterState.emitter.emit('flagsStateChange', cachedFlags);
      }
    }

    this.#adapterState.client = this.#initializeClient(
      sdk.clientSideId,
      this.#adapterState.context,
      sdk.clientOptions ?? {}
    );

    return this.#getInitialFlags({
      flags,
      throwOnInitializationFailure,
      cacheIdentifier: adapterArgs.cacheIdentifier,
    }).then(({ flagsFromSdk, initializationStatus }) => {
      if (flagsFromSdk) {
        this.#setupFlagSubcription({
          flagsFromSdk,
          flagsUpdateDelayMs,
          cacheIdentifier: adapterArgs.cacheIdentifier,
          cacheMode: adapterArgs.cacheMode,
        });
      }

      return { initializationStatus };
    });
  }

  async reconfigure(
    adapterArgs: TLaunchDarklyAdapterArgs,
    _adapterEventHandlers: TAdapterEventHandlers
  ) {
    if (!this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured))
      return Promise.reject(
        new Error(
          '@flopflip/launchdarkly-adapter: please configure adapter before reconfiguring.'
        )
      );

    const nextContext = this.#ensureContext(adapterArgs.context);

    if (!isEqual(this.#adapterState.context, nextContext)) {
      if (adapterArgs.cacheIdentifier) {
        const cache = await getCache(
          adapterArgs.cacheIdentifier,
          adapterIdentifiers.launchdarkly,
          this.#adapterState.context?.key as string
        );

        cache.unset();
      }

      this.#adapterState.context = nextContext;

      await this.#changeClientContext(this.#adapterState.context);

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

  setConfigurationStatus(nextConfigurationStatus: AdapterConfigurationStatus) {
    this.#adapterState.configurationStatus = nextConfigurationStatus;

    this.#adapterState.emitter.emit('statusStateChange', {
      configurationStatus: this.#adapterState.configurationStatus,
    });
  }

  getClient() {
    return this.#adapterState.client;
  }

  getFlag(flagName: TFlagName): TFlagVariation {
    return this.#adapterState.flags[flagName];
  }

  async updateClientContext(
    updatedContextProps: TLaunchDarklyAdapterArgs['context']
  ) {
    const isAdapterConfigured = this.getIsConfigurationStatus(
      AdapterConfigurationStatus.Configured
    );

    warning(
      isAdapterConfigured,
      '@flopflip/launchdarkly-adapter: adapter not configured. Client context can not be updated before.'
    );

    if (!isAdapterConfigured)
      return Promise.reject(
        new Error('Can not update client context: adapter not yet configured.')
      );

    return this.#changeClientContext({
      ...this.#adapterState.context,
      ...updatedContextProps,
    });
  }

  unsubscribe = () => {
    this.#adapterState.subscriptionStatus =
      AdapterSubscriptionStatus.Unsubscribed;
  };

  subscribe = () => {
    this.#adapterState.subscriptionStatus =
      AdapterSubscriptionStatus.Subscribed;
  };
}

const adapter = new LaunchDarklyAdapter();

exposeGlobally(adapter);

export default adapter;
