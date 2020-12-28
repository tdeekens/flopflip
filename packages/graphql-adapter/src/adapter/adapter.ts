import type {
  TUser,
  TAdapterStatus,
  TAdapterStatusChange,
  TAdapterEventHandlers,
  TFlagName,
  TFlagVariation,
  TFlags,
  TFlagsUpdateFunction,
  TFlagsChange,
  TGraphQLAdapterInterface,
  TGraphQLAdapterArgs,
  TCacheIdentifiers,
} from '@flopflip/types';
import {
  AdapterInitializationStatus,
  AdapterSubscriptionStatus,
  AdapterConfigurationStatus,
  adapterIdentifiers,
  cacheIdentifiers,
} from '@flopflip/types';
import {
  normalizeFlags,
  normalizeFlag,
  exposeGlobally,
} from '@flopflip/adapter-utilities';

import warning from 'tiny-warning';
import mitt, { Emitter } from 'mitt';
import isEqual from 'lodash/isEqual';

type GraphQLAdapterState = {
  flags: TFlags;
  user?: TUser;
  emitter: Emitter;
  lockedFlags: Set<TFlagName>;
  cacheIdentifier?: TCacheIdentifiers;
};

const STORAGE_SLICE = '@flopflip';

const intialAdapterState: TAdapterStatus & GraphQLAdapterState = {
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
  flags: {},
  lockedFlags: new Set<TFlagName>(),
  user: {},
  emitter: mitt(),
};

let adapterState: TAdapterStatus & GraphQLAdapterState = {
  ...intialAdapterState,
};

class GraphQLAdapter implements TGraphQLAdapterInterface {
  #__internalConfiguredStatusChange__ = '__internalConfiguredStatusChange__';
  #defaultPollingInteral = 1000 * 60;

  id: typeof adapterIdentifiers.graphql;

  constructor() {
    this.id = adapterIdentifiers.graphql;
  }

  #getIsAdapterUnsubscribed = () =>
    adapterState.subscriptionStatus === AdapterSubscriptionStatus.Unsubscribed;

  #getIsFlagLocked = (flagName: TFlagName) =>
    adapterState.lockedFlags.has(flagName);

  #getCache = async (cacheIdentifier: TCacheIdentifiers) => {
    let cacheModule;

    switch (cacheIdentifier) {
      case cacheIdentifiers.local: {
        cacheModule = await import('@flopflip/localstorage-cache');
        break;
      }

      case cacheIdentifiers.session: {
        cacheModule = await import('@flopflip/sessionstorage-cache');
        break;
      }

      default:
        break;
    }

    const createCache = cacheModule.default;

    const cache = createCache({ prefix: STORAGE_SLICE });

    return {
      set(flags: TFlags) {
        return cache.set('flags', flags);
      },
      get() {
        return cache.get('flags');
      },
      unset() {
        return cache.unset('flags');
      },
    };
  };

  #didFlagsChange = (nextFlags: TFlags) => {
    const previousFlags = adapterState.flags;

    if (previousFlags === undefined) return true;

    return !isEqual(nextFlags, previousFlags);
  };

  #fetchFlags = async (adapterArgs: TGraphQLAdapterArgs): Promise<TFlags> => {
    const fetcher = adapterArgs.adapterConfiguration.fetcher ?? fetch;

    const response = await fetcher(adapterArgs.adapterConfiguration.uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(adapterArgs.adapterConfiguration.getRequestHeaders?.(adapterArgs) ??
          {}),
      },
      body: JSON.stringify({
        query: adapterArgs.adapterConfiguration.query,
        variables:
          adapterArgs.adapterConfiguration?.getQueryVariables?.(adapterArgs) ??
          {},
      }),
    });

    const json = await response.json();

    const flags =
      adapterArgs.adapterConfiguration.parseFlags?.(json.data) ??
      (json.data as TFlags);

    return flags;
  };

  #subscribeToFlagsChanges = (adapterArgs: TGraphQLAdapterArgs) => {
    const pollingInteral =
      adapterArgs.adapterConfiguration.pollingInteral ??
      this.#defaultPollingInteral;

    setInterval(async () => {
      if (!this.#getIsAdapterUnsubscribed()) {
        const nextFlags = normalizeFlags(await this.#fetchFlags(adapterArgs));

        if (this.#didFlagsChange(nextFlags)) {
          if (adapterArgs.cacheIdentifier) {
            const cache = await this.#getCache(adapterArgs.cacheIdentifier);

            cache.set(nextFlags);
          }

          adapterState.flags = nextFlags;
          adapterState.emitter.emit('flagsStateChange', nextFlags);
        }
      }
    }, pollingInteral);
  };

  getUser = () => adapterState.user;

  updateFlags: TFlagsUpdateFunction = (flags, options) => {
    const isAdapterConfigured =
      adapterState.configurationStatus ===
      AdapterConfigurationStatus.Configured;

    warning(
      isAdapterConfigured,
      '@flopflip/graphql-adapter: adapter not configured. Flags can not be updated before.'
    );

    if (!isAdapterConfigured) return;

    const previousFlags: TFlags | null = adapterState.flags;

    const updatedFlags = Object.entries(flags).reduce(
      (updatedFlags, [flagName, flagValue]) => {
        const [normalizedFlagName, normalizedFlagValue] = normalizeFlag(
          flagName,
          flagValue
        );

        if (this.#getIsFlagLocked(normalizedFlagName)) return updatedFlags;

        if (options?.lockFlags) {
          adapterState.lockedFlags.add(normalizedFlagName);
        }

        updatedFlags = {
          ...updatedFlags,
          [normalizedFlagName]: normalizedFlagValue,
        };

        return updatedFlags;
      },
      {}
    );

    const nextFlags: TFlags = {
      ...previousFlags,
      ...updatedFlags,
    };

    adapterState.flags = nextFlags;

    adapterState.emitter.emit('flagsStateChange', nextFlags);
  };

  async configure(
    adapterArgs: TGraphQLAdapterArgs,
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

    adapterState.emitter.on<TFlagsChange>(
      'flagsStateChange',
      // @ts-expect-error
      handleFlagsChange
    );
    adapterState.emitter.on<TAdapterStatusChange>(
      'statusStateChange',
      // @ts-expect-error
      handleStatusChange
    );

    adapterState.configurationStatus = AdapterConfigurationStatus.Configuring;

    adapterState.emitter.emit('statusStateChange', {
      configurationStatus: adapterState.configurationStatus,
    });

    adapterState.user = adapterArgs.user;

    return Promise.resolve().then(async () => {
      let cachedFlags;

      if (adapterArgs.cacheIdentifier) {
        const cache = await this.#getCache(adapterArgs.cacheIdentifier);

        cachedFlags = cache.get();

        if (cachedFlags) {
          adapterState.flags = cachedFlags;

          adapterState.emitter.emit('flagsStateChange', cachedFlags);
        }
      }

      adapterState.configurationStatus = AdapterConfigurationStatus.Configured;

      const flags = normalizeFlags(await this.#fetchFlags(adapterArgs));

      adapterState.flags = flags;

      if (adapterArgs.cacheIdentifier) {
        const cache = await this.#getCache(adapterArgs.cacheIdentifier);

        cache.set(flags);
      }

      adapterState.emitter.emit('flagsStateChange', flags);
      adapterState.emitter.emit('statusStateChange', {
        configurationStatus: adapterState.configurationStatus,
      });
      adapterState.emitter.emit(this.#__internalConfiguredStatusChange__);

      this.#subscribeToFlagsChanges(adapterArgs);

      return {
        initializationStatus: AdapterInitializationStatus.Succeeded,
      };
    });
  }

  async reconfigure(
    adapterArgs: TGraphQLAdapterArgs,
    _adapterEventHandlers: TAdapterEventHandlers
  ) {
    adapterState.flags = {};

    if (adapterArgs.cacheIdentifier) {
      const cache = await this.#getCache(adapterArgs.cacheIdentifier);

      cache.unset();
    }

    const nextUser = adapterArgs.user;
    adapterState.user = nextUser;

    adapterState.emitter.emit('flagsStateChange', {});

    return Promise.resolve({
      initializationStatus: AdapterInitializationStatus.Succeeded,
    });
  }

  async waitUntilConfigured() {
    return new Promise<void>((resolve) => {
      if (
        adapterState.configurationStatus ===
        AdapterConfigurationStatus.Configured
      )
        resolve();
      else
        adapterState.emitter.on(
          this.#__internalConfiguredStatusChange__,
          resolve
        );
    });
  }

  getIsConfigurationStatus(configurationStatus: AdapterConfigurationStatus) {
    return adapterState.configurationStatus === configurationStatus;
  }

  getFlag(flagName: TFlagName): TFlagVariation {
    return adapterState?.flags[flagName];
  }

  reset = () => {
    adapterState = {
      ...intialAdapterState,
    };
  };

  setConfigurationStatus(nextConfigurationStatus: AdapterConfigurationStatus) {
    adapterState.configurationStatus = nextConfigurationStatus;

    adapterState.emitter.emit('statusStateChange', {
      configurationStatus: adapterState.configurationStatus,
    });
  }

  unsubscribe = () => {
    adapterState.subscriptionStatus = AdapterSubscriptionStatus.Unsubscribed;
  };

  subscribe = () => {
    adapterState.subscriptionStatus = AdapterSubscriptionStatus.Subscribed;
  };
}

const adapter = new GraphQLAdapter();

exposeGlobally(adapter);

export default adapter;
