import {
  exposeGlobally,
  normalizeFlag,
  normalizeFlags,
} from '@flopflip/adapter-utilities';
import { getCache } from '@flopflip/cache';
import {
  AdapterConfigurationStatus,
  AdapterInitializationStatus,
  AdapterSubscriptionStatus,
  type TAdapterEventHandlers,
  type TAdapterStatus,
  type TAdapterStatusChange,
  type TCacheIdentifiers,
  type TFlagName,
  type TFlagVariation,
  type TFlags,
  type TFlagsChange,
  type TFlagsUpdateFunction,
  type TGraphQlAdapterArgs,
  type TGraphQlAdapterInterface,
  type TUser,
  adapterIdentifiers,
  cacheModes,
} from '@flopflip/types';
import isEqual from 'lodash/isEqual';
import mitt, { type Emitter } from 'mitt';
import warning from 'tiny-warning';

type TInternalStatusChange = '__internalConfiguredStatusChange__';
type TEmitterEvents = {
  __internalConfiguredStatusChange__: undefined;
  flagsStateChange: TFlags;
  statusStateChange: Partial<TAdapterStatus>;
};
type TGraphQlAdapterState = {
  flags: TFlags;
  user?: TUser;
  emitter: Emitter<TEmitterEvents>;
  lockedFlags: Set<TFlagName>;
  cacheIdentifier?: TCacheIdentifiers;
};

const intialAdapterState: TAdapterStatus & TGraphQlAdapterState = {
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
  flags: {},
  lockedFlags: new Set<TFlagName>(),
  user: {},
  emitter: mitt(),
};

class GraphQlAdapter implements TGraphQlAdapterInterface {
  id: typeof adapterIdentifiers.graphql;

  #__internalConfiguredStatusChange__: TInternalStatusChange =
    '__internalConfiguredStatusChange__';

  #adapterState: TAdapterStatus & TGraphQlAdapterState;
  #flagPollingInternal?: ReturnType<typeof setInterval>;
  readonly #defaultpollingIntervalMs = 1000 * 60;

  constructor() {
    this.id = adapterIdentifiers.graphql;
    this.#adapterState = {
      ...intialAdapterState,
    };
  }

  readonly #getIsAdapterUnsubscribed = () =>
    this.#adapterState.subscriptionStatus ===
    AdapterSubscriptionStatus.Unsubscribed;

  readonly #getIsFlagLocked = (flagName: TFlagName) =>
    this.#adapterState.lockedFlags.has(flagName);

  readonly #didFlagsChange = (nextFlags: TFlags) => {
    const previousFlags = this.#adapterState.flags;

    if (previousFlags === undefined) {
      return true;
    }

    return !isEqual(nextFlags, previousFlags);
  };

  readonly #fetchFlags = async (
    adapterArgs: TGraphQlAdapterArgs
  ): Promise<TFlags> => {
    const fetcher = adapterArgs.fetcher ?? fetch;

    const response = await fetcher(adapterArgs.uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(adapterArgs.getRequestHeaders?.(adapterArgs) ?? {}),
      },
      body: JSON.stringify({
        query: adapterArgs.query,
        variables: adapterArgs?.getQueryVariables?.(adapterArgs) ?? {},
      }),
    });

    const json = await response.json();

    const flags = adapterArgs.parseFlags?.(json.data) ?? (json.data as TFlags);

    return flags;
  };

  readonly #subscribeToFlagsChanges = (adapterArgs: TGraphQlAdapterArgs) => {
    const pollingIntervalMs =
      adapterArgs.pollingIntervalMs ?? this.#defaultpollingIntervalMs;

    if (this.#flagPollingInternal) {
      clearInterval(this.#flagPollingInternal);
    }

    this.#flagPollingInternal = setInterval(async () => {
      if (!this.#getIsAdapterUnsubscribed()) {
        const nextFlags = normalizeFlags(await this.#fetchFlags(adapterArgs));

        if (this.#didFlagsChange(nextFlags)) {
          if (adapterArgs.cacheIdentifier) {
            const cache = await getCache(
              adapterArgs.cacheIdentifier,
              adapterIdentifiers.graphql,
              { key: this.#adapterState.user?.key }
            );

            cache.set(nextFlags);
          }

          this.#adapterState.flags = nextFlags;

          if (adapterArgs.cacheMode === cacheModes.lazy) {
            return;
          }

          this.#adapterState.emitter.emit('flagsStateChange', nextFlags);
        }
      }
    }, pollingIntervalMs);
  };

  getUser = () => this.#adapterState.user;

  updateFlags: TFlagsUpdateFunction = (flags, options) => {
    const isAdapterConfigured = this.getIsConfigurationStatus(
      AdapterConfigurationStatus.Configured
    );

    warning(
      isAdapterConfigured,
      '@flopflip/graphql-adapter: adapter not configured. Flags can not be updated before.'
    );

    if (!isAdapterConfigured) {
      return;
    }

    const previousFlags: TFlags | undefined = this.#adapterState.flags;

    const updatedFlags = Object.entries(flags).reduce(
      (updatedFlags, [flagName, flagValue]) => {
        const [normalizedFlagName, normalizedFlagValue] = normalizeFlag(
          flagName,
          flagValue
        );

        if (this.#getIsFlagLocked(normalizedFlagName)) {
          return updatedFlags;
        }

        if (options?.lockFlags) {
          this.#adapterState.lockedFlags.add(normalizedFlagName);
        }

        const updated = {
          ...updatedFlags,
          [normalizedFlagName]: normalizedFlagValue,
        };

        return updated;
      },
      {}
    );

    const nextFlags: TFlags = {
      ...previousFlags,
      ...updatedFlags,
    };

    this.#adapterState.flags = nextFlags;
    this.#adapterState.emitter.emit('flagsStateChange', nextFlags);
  };

  async configure(
    adapterArgs: TGraphQlAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) {
    const handleFlagsChange = (nextFlags: TFlagsChange['flags']) => {
      if (this.#getIsAdapterUnsubscribed()) {
        return;
      }

      adapterEventHandlers.onFlagsStateChange({
        flags: nextFlags,
        id: this.id,
      });
    };

    const handleStatusChange = (nextStatus: TAdapterStatusChange['status']) => {
      if (this.#getIsAdapterUnsubscribed()) {
        return;
      }

      adapterEventHandlers.onStatusStateChange({
        status: nextStatus,
        id: this.id,
      });
    };

    this.#adapterState.emitter.on('flagsStateChange', handleFlagsChange);
    this.#adapterState.emitter.on('statusStateChange', handleStatusChange);

    this.setConfigurationStatus(AdapterConfigurationStatus.Configuring);

    this.#adapterState.user = adapterArgs.user;

    return Promise.resolve().then(async () => {
      let cachedFlags = null;

      if (adapterArgs.cacheIdentifier) {
        const cache = await getCache(
          adapterArgs.cacheIdentifier,
          adapterIdentifiers.graphql,
          { key: this.#adapterState.user?.key }
        );

        cachedFlags = cache.get();

        if (cachedFlags) {
          this.#adapterState.flags = cachedFlags;
          this.#adapterState.emitter.emit(
            'flagsStateChange',
            cachedFlags as TFlags
          );
        }
      }

      this.setConfigurationStatus(AdapterConfigurationStatus.Configured);

      const flags = normalizeFlags(await this.#fetchFlags(adapterArgs));

      this.#adapterState.flags = flags;

      if (adapterArgs.cacheIdentifier) {
        const cache = await getCache(
          adapterArgs.cacheIdentifier,
          adapterIdentifiers.graphql,
          { key: this.#adapterState.user?.key }
        );

        cache.set(flags);
      }

      if (adapterArgs.cacheMode !== cacheModes.lazy) {
        this.#adapterState.emitter.emit('flagsStateChange', flags);
      }

      this.#adapterState.emitter.emit(this.#__internalConfiguredStatusChange__);

      this.#subscribeToFlagsChanges(adapterArgs);

      return {
        initializationStatus: AdapterInitializationStatus.Succeeded,
      };
    });
  }

  async reconfigure(
    adapterArgs: TGraphQlAdapterArgs,
    _adapterEventHandlers: TAdapterEventHandlers
  ) {
    if (!this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)) {
      return Promise.reject(
        new Error(
          '@flopflip/graphql-adapter: please configure adapter before reconfiguring.'
        )
      );
    }

    this.#adapterState.flags = {};

    if (adapterArgs.cacheIdentifier) {
      const cache = await getCache(
        adapterArgs.cacheIdentifier,
        adapterIdentifiers.graphql,
        { key: this.#adapterState.user?.key }
      );

      cache.unset();
    }

    const nextUser = adapterArgs.user;

    this.#adapterState.user = nextUser;

    const flags = normalizeFlags(await this.#fetchFlags(adapterArgs));

    this.#adapterState.flags = flags;

    this.#adapterState.emitter.emit('flagsStateChange', flags);

    this.#adapterState.emitter.emit(this.#__internalConfiguredStatusChange__);

    this.#subscribeToFlagsChanges(adapterArgs);

    return Promise.resolve({
      initializationStatus: AdapterInitializationStatus.Succeeded,
    });
  }

  async waitUntilConfigured() {
    return new Promise<void>((resolve) => {
      if (
        this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
      ) {
        resolve();
      } else {
        this.#adapterState.emitter.on(
          this.#__internalConfiguredStatusChange__,
          resolve
        );
      }
    });
  }

  getIsConfigurationStatus(configurationStatus: AdapterConfigurationStatus) {
    return this.#adapterState.configurationStatus === configurationStatus;
  }

  getFlag(flagName: TFlagName): TFlagVariation {
    return this.#adapterState?.flags[flagName];
  }

  reset = () => {
    this.#adapterState = {
      ...intialAdapterState,
    };
  };

  setConfigurationStatus(nextConfigurationStatus: AdapterConfigurationStatus) {
    this.#adapterState.configurationStatus = nextConfigurationStatus;

    this.#adapterState.emitter.emit('statusStateChange', {
      configurationStatus: this.#adapterState.configurationStatus,
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

const adapter = new GraphQlAdapter();

exposeGlobally(adapter);

export default adapter;
