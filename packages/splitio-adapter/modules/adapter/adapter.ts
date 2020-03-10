import {
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
  TAdapterSubscriptionStatus,
  TAdapterConfigurationStatus,
  TAdapterInitializationStatus,
  interfaceIdentifiers,
} from '@flopflip/types';
import merge from 'deepmerge';
import warning from 'tiny-warning';
import { SplitFactory } from '@splitsoftware/splitio';
import camelCase from 'lodash/camelCase';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';

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
  subscriptionStatus: TAdapterSubscriptionStatus.Subscribed,
  configurationStatus: TAdapterConfigurationStatus.Unconfigured,
  user: undefined,
  client: undefined,
  manager: undefined,
  configuredCallbacks: {
    onFlagsStateChange: () => undefined,
    onStatusStateChange: () => undefined,
  },
  splitioSettings: undefined,
};

const getIsUnsubscribed = () =>
  adapterState.subscriptionStatus === TAdapterSubscriptionStatus.Unsubscribed;

export const normalizeFlag = (
  flagName: TFlagName,
  flagValue: TFlagVariation
): TFlag => {
  let normalizeFlagValue;
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

export const normalizeFlags = (flags: TFlags) =>
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

const subscribeToFlagsChanges = ({
  flagNames,
  onFlagsStateChange,
}: {
  flagNames: TFlagName[];
  onFlagsStateChange: TOnFlagsStateChangeCallback;
}) => {
  if (adapterState.client) {
    adapterState.client.on(adapterState.client.Event.SDK_UPDATE, () => {
      if (adapterState.client) {
        const flags = adapterState.client.getTreatments(flagNames, {
          ...adapterState.user,
          ...adapterState.treatmentAttributes,
        } as SplitIO.Attributes);

        if (!getIsUnsubscribed()) {
          onFlagsStateChange(normalizeFlags(flags));
        }
      }
    });
  }
};

export const createAnonymousUserKey = () =>
  Math.random()
    .toString(36)
    .substring(2);

const ensureUser = (user: TUser): TUser =>
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

const subscribe = ({
  onFlagsStateChange,
  onStatusStateChange,
}: {
  onFlagsStateChange: TOnFlagsStateChangeCallback;
  onStatusStateChange: TOnStatusStateChangeCallback;
}) =>
  new Promise<void>((resolve, reject) => {
    if (adapterState.client) {
      adapterState.configurationStatus =
        TAdapterConfigurationStatus.Configuring;

      onStatusStateChange({
        configurationStatus: adapterState.configurationStatus,
      });

      adapterState.client.on(adapterState.client.Event.SDK_READY, () => {
        let flagNames: TFlagName[];
        let flags: TFlags;

        if (adapterState.client && adapterState.manager) {
          flagNames = adapterState.manager.names();
          flags = adapterState.client.getTreatments(flagNames, {
            ...adapterState.user,
            ...adapterState.treatmentAttributes,
          } as SplitIO.Attributes);

          if (!getIsUnsubscribed()) {
            onFlagsStateChange(normalizeFlags(flags));
          }

          // First update internal state
          adapterState.configurationStatus =
            TAdapterConfigurationStatus.Configured;
          // ...to then signal that the adapter is configured

          if (!getIsUnsubscribed()) {
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

const configureSplitio = () => {
  const { client, manager } = initializeClient();

  adapterState.client = client;
  adapterState.manager = manager;

  return subscribe({
    onFlagsStateChange: adapterState.configuredCallbacks.onFlagsStateChange,
    onStatusStateChange: adapterState.configuredCallbacks.onStatusStateChange,
  }).then(() => {
    return {
      initializationStatus: TAdapterInitializationStatus.Succeeded,
    };
  });
};

class SplitioAdapter implements TSplitioAdapterInterface {
  id: typeof interfaceIdentifiers.splitio;

  constructor() {
    this.id = interfaceIdentifiers.splitio;
  }

  configure(
    adapterArgs: TSplitioAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) {
    const {
      authorizationKey,
      user,
      options = {},
      treatmentAttributes,
    } = adapterArgs;

    adapterState.configurationStatus = TAdapterConfigurationStatus.Configuring;

    adapterState.user = ensureUser(user);
    adapterState.treatmentAttributes = treatmentAttributes;

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

  reconfigure(
    adapterArgs: TSplitioAdapterArgs,
    _adapterEventHandlers: TAdapterEventHandlers
  ) {
    if (
      adapterState.configurationStatus !==
        TAdapterConfigurationStatus.Configured ||
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
      adapterState.treatmentAttributes = adapterArgs.treatmentAttributes;
    }

    if (
      (hasUserChanged || hasTreatmentChanged) &&
      adapterState.manager &&
      adapterState.client
    ) {
      adapterState.client.destroy();

      return configureSplitio();
    }

    return Promise.resolve({
      initializationStatus: TAdapterInitializationStatus.Succeeded,
    });
  }

  getIsConfigurationStatus(configurationStatus: TAdapterConfigurationStatus) {
    return adapterState.configurationStatus === configurationStatus;
  }

  unsubscribe() {
    adapterState.subscriptionStatus = TAdapterSubscriptionStatus.Unsubscribed;
  }

  subscribe() {
    adapterState.subscriptionStatus = TAdapterSubscriptionStatus.Subscribed;
  }

  // NOTE: This function is deprecated. Please use `getIsConfigurationStatus`.
  getIsReady() {
    warning(
      false,
      '@flopflip/splitio-adapter: `getIsReady` has been deprecated. Please use `getIsConfigurationStatus` instead.'
    );

    return this.getIsConfigurationStatus(
      TAdapterConfigurationStatus.Configured
    );
  }
}

const adapter = new SplitioAdapter();
export default adapter;
