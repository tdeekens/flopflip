import type {
  TUser,
  TAdapterStatus,
  TAdapterStatusChange,
  TAdapterEventHandlers,
  TFlagName,
  TFlagVariation,
  TFlag,
  TFlags,
  TFlagsUpdateFunction,
  TFlagsChange,
  TGraphQLAdapterInterface,
  TGraphQLAdapterArgs,
} from '@flopflip/types';
import {
  AdapterInitializationStatus,
  AdapterSubscriptionStatus,
  AdapterConfigurationStatus,
  interfaceIdentifiers,
} from '@flopflip/types';

import warning from 'tiny-warning';
import mitt, { Emitter } from 'mitt';
import camelCase from 'lodash/camelCase';
import isEqual from 'lodash/isEqual';
import getGlobalThis from 'globalthis';

type GraphQLAdapterState = {
  flags: TFlags;
  user?: TUser;
  emitter: Emitter;
  lockedFlags: Set<TFlagName>;
};

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

const getIsAdapterUnsubscribed = () =>
  adapterState.subscriptionStatus === AdapterSubscriptionStatus.Unsubscribed;
const getIsFlagLocked = (flagName: TFlagName) =>
  adapterState.lockedFlags.has(flagName);
const getUser = () => adapterState.user;

const normalizeFlag = (
  flagName: TFlagName,
  flagValue?: TFlagVariation
): TFlag => [
  camelCase(flagName),
  // Multi variate flags contain a string or `null` - `false` seems more natural.
  flagValue === null || flagValue === undefined ? false : flagValue,
];
const normalizeFlags = (rawFlags: TFlags): Record<'string', TFlagVariation> =>
  Object.entries(rawFlags || {}).reduce<TFlags>(
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

const updateFlags: TFlagsUpdateFunction = (flags, options) => {
  const isAdapterConfigured =
    adapterState.configurationStatus === AdapterConfigurationStatus.Configured;

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

      if (getIsFlagLocked(normalizedFlagName)) return updatedFlags;

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

const didFlagsChange = (nextFlags: TFlags) => {
  const previousFlags = adapterState.flags;

  if (previousFlags === undefined) return true;

  return !isEqual(nextFlags, previousFlags);
};

const fetchFlags = async (
  adapterArgs: TGraphQLAdapterArgs
): Promise<TFlags> => {
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
  const flags = json.data as TFlags;

  return flags;
};

const defaultPollingInteral = 1000 * 60;
const subscribeToFlagsChanges = (adapterArgs: TGraphQLAdapterArgs) => {
  const pollingInteral =
    adapterArgs.adapterConfiguration.pollingInteral ?? defaultPollingInteral;

  setInterval(async () => {
    if (!getIsAdapterUnsubscribed()) {
      const nextFlags = normalizeFlags(await fetchFlags(adapterArgs));

      if (didFlagsChange(nextFlags)) {
        adapterState.flags = nextFlags;
        adapterState.emitter.emit('flagsStateChange', nextFlags);
      }
    }
  }, pollingInteral);
};

const __internalConfiguredStatusChange__ = '__internalConfiguredStatusChange__';

class GraphQLAdapter implements TGraphQLAdapterInterface {
  id: typeof interfaceIdentifiers.graphql;

  constructor() {
    this.id = interfaceIdentifiers.graphql;
  }

  async configure(
    adapterArgs: TGraphQLAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) {
    const handleFlagsChange = (nextFlags: TFlags) => {
      if (getIsAdapterUnsubscribed()) return;

      adapterEventHandlers.onFlagsStateChange(nextFlags);
    };

    const handleStatusChange = (nextStatus: TAdapterStatusChange) => {
      if (getIsAdapterUnsubscribed()) return;

      adapterEventHandlers.onStatusStateChange(nextStatus);
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
      adapterState.configurationStatus = AdapterConfigurationStatus.Configured;

      const flags = normalizeFlags(await fetchFlags(adapterArgs));

      adapterState.flags = flags;
      adapterState.emitter.emit('flagsStateChange', flags);
      adapterState.emitter.emit('statusStateChange', {
        configurationStatus: adapterState.configurationStatus,
      });
      adapterState.emitter.emit(__internalConfiguredStatusChange__);

      subscribeToFlagsChanges(adapterArgs);

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
      else adapterState.emitter.on(__internalConfiguredStatusChange__, resolve);
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
      '@flopflip/graphql-adapter: `getIsReady` has been deprecated. Please use `getIsConfigurationStatus` instead.'
    );

    return this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured);
  }
}

const adapter = new GraphQLAdapter();

const exposeGlobally = () => {
  const globalThis = getGlobalThis();

  if (!globalThis.__flopflip__) {
    globalThis.__flopflip__ = {};
  }

  globalThis.__flopflip__.graphql = {
    adapter,
    updateFlags,
  };
};

exposeGlobally();

export default adapter;
export { updateFlags, getUser, normalizeFlag };
