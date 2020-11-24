/* global SplitIO */

import type { DeepReadonly, Writable, DeepWritable } from 'ts-essentials';
import type {
  TFlagName,
  TFlagVariation,
  TAdapterStatus,
  TUser,
  TFlag,
  TFlags,
  TOnFlagsStateChangeCallback,
  TOnStatusStateChangeCallback,
  TAdapterEventHandlers,
  TSplitioAdapterInterface,
  TSplitioAdapterArgs,
  TFlagsUpdateFunction,
} from '@flopflip/types';
import {
  AdapterInitializationStatus,
  AdapterSubscriptionStatus,
  AdapterConfigurationStatus,
  interfaceIdentifiers,
} from '@flopflip/types';

import merge from 'deepmerge';
import warning from 'tiny-warning';
import { SplitFactory } from '@splitsoftware/splitio';
import camelCase from 'lodash/camelCase';
import cloneDeep from 'lodash/cloneDeep';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import getGlobalThis from 'globalthis';

type SplitIOAdapterState = {
  user?: TUser;
  client?: SplitIO.IClient;
  manager?: SplitIO.IManager;
  configuredCallbacks: {
    onFlagsStateChange: TOnFlagsStateChangeCallback;
    onStatusStateChange: TOnStatusStateChangeCallback;
  };
  splitioSettings?: SplitIO.IBrowserSettings;
  treatmentAttributes?: SplitIO.Attributes;
};

const adapterState: TAdapterStatus & SplitIOAdapterState = {
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
  user: undefined,
  client: undefined,
  manager: undefined,
  configuredCallbacks: {
    onFlagsStateChange: () => undefined,
    onStatusStateChange: () => undefined,
  },
  splitioSettings: undefined,
};

const getIsAdapterUnsubscribed = () =>
  adapterState.subscriptionStatus === AdapterSubscriptionStatus.Unsubscribed;

const normalizeFlag = (
  flagName: TFlagName,
  flagValue: TFlagVariation
): TFlag => {
  let normalizeFlagValue: TFlagVariation;
  if (flagValue === null) {
    normalizeFlagValue = false;
  } else if (flagValue === 'on') {
    normalizeFlagValue = true;
  } else if (flagValue === 'off') {
    normalizeFlagValue = false;
  } else {
    normalizeFlagValue = flagValue;
  }

  return [camelCase(flagName), normalizeFlagValue];
};

const normalizeFlags = (
  flags: Readonly<TFlags>
): Record<'string', TFlagVariation> =>
  Object.entries(flags).reduce<TFlags>(
    (normalizedFlags: TFlags, [flagName, flaValue]) => {
      const [normalizedFlagName, normalizedFlagValue]: TFlag = normalizeFlag(
        flagName,
        flaValue
      );

      normalizedFlags[normalizedFlagName] = normalizedFlagValue;

      return normalizedFlags;
    },
    {}
  );

const updateFlags: TFlagsUpdateFunction = () => {
  console.log(
    '@flopflip/splitio-adapter: update flags it not yet implemented.'
  );
};

const subscribeToFlagsChanges = ({
  flagNames,
  onFlagsStateChange,
}: DeepReadonly<{
  flagNames: TFlagName[];
  onFlagsStateChange: TOnFlagsStateChangeCallback;
}>) => {
  if (adapterState.client) {
    adapterState.client.on(adapterState.client.Event.SDK_UPDATE, () => {
      if (adapterState.client && adapterState.user?.key) {
        const flags = adapterState.client.getTreatments(
          adapterState.user.key,
          flagNames as Writable<TFlagName[]>,
          {
            ...adapterState.user,
            ...adapterState.treatmentAttributes,
          } as SplitIO.Attributes
        );

        if (!getIsAdapterUnsubscribed()) {
          onFlagsStateChange(normalizeFlags(flags));
        }
      }
    });
  }
};

const createAnonymousUserKey = () => Math.random().toString(36).substring(2);

const ensureUser = (user: Readonly<TUser>): TUser =>
  merge(user, { key: user?.key ?? createAnonymousUserKey() });

type SplitIOClient = {
  client: SplitIO.IClient;
  manager: SplitIO.IManager;
};
const initializeClient = (): SplitIOClient => {
  if (!adapterState.splitioSettings) {
    throw Error(
      'cannot initialize SplitIo without configured settings, call configure() first'
    );
  }

  const sdk = SplitFactory(adapterState.splitioSettings); // eslint-disable-line new-cap

  return {
    client: sdk.client(),
    manager: sdk.manager(),
  };
};

const subscribe = async ({
  onFlagsStateChange,
  onStatusStateChange,
}: Readonly<{
  onFlagsStateChange: TOnFlagsStateChangeCallback;
  onStatusStateChange: TOnStatusStateChangeCallback;
}>) =>
  new Promise<void>((resolve, reject) => {
    if (adapterState.client) {
      adapterState.configurationStatus = AdapterConfigurationStatus.Configuring;

      onStatusStateChange({
        configurationStatus: adapterState.configurationStatus,
      });

      adapterState.client.on(adapterState.client.Event.SDK_READY, () => {
        let flagNames: TFlagName[];
        let flags: TFlags;

        if (
          adapterState.client &&
          adapterState.manager &&
          adapterState.user?.key
        ) {
          flagNames = adapterState.manager.names();
          flags = adapterState.client.getTreatments(
            adapterState.user.key,
            flagNames,
            {
              ...adapterState.user,
              ...adapterState.treatmentAttributes,
            } as SplitIO.Attributes
          );

          if (!getIsAdapterUnsubscribed()) {
            onFlagsStateChange(normalizeFlags(flags));
          }

          // First update internal state
          adapterState.configurationStatus =
            AdapterConfigurationStatus.Configured;
          // ...to then signal that the adapter is configured

          if (!getIsAdapterUnsubscribed()) {
            onStatusStateChange({
              configurationStatus: adapterState.configurationStatus,
            });
          }

          // ...to finally subscribe to later changes.
          subscribeToFlagsChanges({
            flagNames,
            onFlagsStateChange,
          });

          return resolve();
        }
      });
    } else reject();
  });

const configureSplitio = async () => {
  const { client, manager } = initializeClient();

  adapterState.client = client;
  adapterState.manager = manager;

  return subscribe({
    onFlagsStateChange: adapterState.configuredCallbacks.onFlagsStateChange,
    onStatusStateChange: adapterState.configuredCallbacks.onStatusStateChange,
  }).then(() => {
    return {
      initializationStatus: AdapterInitializationStatus.Succeeded,
    };
  });
};

const cloneTreatmentAttributes = <
  T = TSplitioAdapterArgs['treatmentAttributes']
>(
  treatmentAttributes: DeepReadonly<T>
): DeepWritable<T> =>
  cloneDeep<DeepWritable<T>>(treatmentAttributes as DeepWritable<T>);

class SplitioAdapter implements TSplitioAdapterInterface {
  id: typeof interfaceIdentifiers.splitio;

  constructor() {
    this.id = interfaceIdentifiers.splitio;
  }

  async configure(
    adapterArgs: DeepReadonly<TSplitioAdapterArgs>,
    adapterEventHandlers: DeepReadonly<TAdapterEventHandlers>
  ) {
    const {
      authorizationKey,
      user,
      options = {},
      treatmentAttributes,
    } = adapterArgs;

    adapterState.configurationStatus = AdapterConfigurationStatus.Configuring;

    adapterState.user = ensureUser(user);
    adapterState.treatmentAttributes = cloneTreatmentAttributes(
      treatmentAttributes
    );
    adapterState.configuredCallbacks.onFlagsStateChange =
      adapterEventHandlers.onFlagsStateChange;
    adapterState.configuredCallbacks.onStatusStateChange =
      adapterEventHandlers.onStatusStateChange;

    adapterState.splitioSettings = {
      ...omit(options, ['core']),
      core: {
        authorizationKey,
        key: adapterState.user.key ?? createAnonymousUserKey(),
        ...options.core,
      },
    };

    return configureSplitio();
  }

  async reconfigure(
    adapterArgs: DeepReadonly<TSplitioAdapterArgs>,
    _adapterEventHandlers: DeepReadonly<TAdapterEventHandlers>
  ) {
    if (
      adapterState.configurationStatus !==
        AdapterConfigurationStatus.Configured ||
      !adapterState.user
    ) {
      return Promise.reject(
        new Error(
          '@flopflip/splitio-adapter: please configure adapter before reconfiguring.'
        )
      );
    }

    const hasUserChanged = !isEqual(adapterState.user, adapterArgs.user);
    const hasTreatmentChanged = !isEqual(
      adapterState.treatmentAttributes,
      adapterArgs.treatmentAttributes
    );

    if (hasUserChanged) {
      adapterState.user = ensureUser(adapterArgs.user);
    }

    if (hasTreatmentChanged) {
      adapterState.treatmentAttributes = cloneTreatmentAttributes(
        adapterArgs.treatmentAttributes
      );
    }

    if (
      (hasUserChanged || hasTreatmentChanged) &&
      adapterState.manager &&
      adapterState.client
    ) {
      await adapterState.client.destroy();

      return configureSplitio();
    }

    return Promise.resolve({
      initializationStatus: AdapterInitializationStatus.Succeeded,
    });
  }

  getIsConfigurationStatus(configurationStatus: AdapterConfigurationStatus) {
    return adapterState.configurationStatus === configurationStatus;
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
      '@flopflip/splitio-adapter: `getIsReady` has been deprecated. Please use `getIsConfigurationStatus` instead.'
    );

    return this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured);
  }
}

const adapter = new SplitioAdapter();

const exposeGlobally = () => {
  const globalThis = getGlobalThis();

  if (!globalThis.__flopflip__) {
    globalThis.__flopflip__ = {};
  }

  globalThis.__flopflip__.splitio = {
    adapter,
  };
};

exposeGlobally();

export default adapter;
export { createAnonymousUserKey, normalizeFlag, normalizeFlags, updateFlags };
