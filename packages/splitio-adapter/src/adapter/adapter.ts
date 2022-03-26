/* global SplitIO */
import { exposeGlobally, normalizeFlags } from '@flopflip/adapter-utilities';
import {
  type TAdapterEventHandlers,
  type TAdapterStatus,
  type TFlag,
  type TFlagName,
  type TFlags,
  type TFlagVariation,
  type TSplitioAdapterArgs,
  type TSplitioAdapterInterface,
  type TUser,
  AdapterConfigurationStatus,
  adapterIdentifiers,
  AdapterInitializationStatus,
  AdapterSubscriptionStatus,
} from '@flopflip/types';
import { SplitFactory } from '@splitsoftware/splitio';
import camelCase from 'lodash/camelCase';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import omit from 'lodash/omit';
import merge from 'merge-deep';

type TSplitIOAdapterState = {
  user?: TUser;
  client?: SplitIO.IClient;
  manager?: SplitIO.IManager;
  configuredCallbacks: {
    onFlagsStateChange: TAdapterEventHandlers['onFlagsStateChange'];
    onStatusStateChange: TAdapterEventHandlers['onStatusStateChange'];
  };
  splitioSettings?: SplitIO.IBrowserSettings;
  treatmentAttributes?: SplitIO.Attributes;
};
type SplitIOClient = {
  client: SplitIO.IClient;
  manager: SplitIO.IManager;
};

const normalizeFlag = (
  flagName: TFlagName,
  flagValue?: TFlagVariation
): TFlag => {
  let normalizeFlagValue: TFlagVariation;

  if (flagValue === 'on') {
    normalizeFlagValue = true;
  } else if (flagValue === 'off') {
    normalizeFlagValue = false;
    // eslint-disable-next-line no-eq-null, eqeqeq, no-negated-condition
  } else if (flagValue != null) {
    normalizeFlagValue = flagValue;
  } else {
    normalizeFlagValue = false;
  }

  return [camelCase(flagName), normalizeFlagValue];
};

const createAnonymousUserKey = () => Math.random().toString(36).substring(2);

class SplitioAdapter implements TSplitioAdapterInterface {
  #adapterState: TAdapterStatus & TSplitIOAdapterState;
  id: typeof adapterIdentifiers.splitio;

  constructor() {
    this.#adapterState = {
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
    this.id = adapterIdentifiers.splitio;
  }

  #getIsAdapterUnsubscribed = () =>
    this.#adapterState.subscriptionStatus ===
    AdapterSubscriptionStatus.Unsubscribed;

  #subscribeToFlagsChanges = ({
    flagNames,
    onFlagsStateChange,
  }: {
    flagNames: TFlagName[];
    onFlagsStateChange: TAdapterEventHandlers['onFlagsStateChange'];
  }) => {
    if (this.#adapterState.client) {
      this.#adapterState.client.on(
        this.#adapterState.client.Event.SDK_UPDATE,
        () => {
          if (this.#adapterState.client && this.#adapterState.user?.key) {
            const flags = this.#adapterState.client.getTreatments(
              this.#adapterState.user.key,
              flagNames,
              {
                ...this.#adapterState.user,
                ...this.#adapterState.treatmentAttributes,
              } as SplitIO.Attributes
            );

            if (!this.#getIsAdapterUnsubscribed()) {
              onFlagsStateChange({ id: this.id, flags: normalizeFlags(flags) });
            }
          }
        }
      );
    }
  };

  #ensureUser = (user: TUser): TUser =>
    merge(user, { key: user?.key ?? createAnonymousUserKey() });

  #initializeClient = (): SplitIOClient => {
    if (!this.#adapterState.splitioSettings) {
      throw Error(
        'cannot initialize SplitIo without configured settings, call configure() first'
      );
    }

    const sdk = SplitFactory(this.#adapterState.splitioSettings); // eslint-disable-line new-cap

    return {
      client: sdk.client(),
      manager: sdk.manager(),
    };
  };

  #subscribeToFlagChanges = async ({
    onFlagsStateChange,
    onStatusStateChange,
  }: {
    onFlagsStateChange: TAdapterEventHandlers['onFlagsStateChange'];
    onStatusStateChange: TAdapterEventHandlers['onStatusStateChange'];
  }) =>
    new Promise<void>((resolve, reject) => {
      if (this.#adapterState.client) {
        this.#adapterState.configurationStatus =
          AdapterConfigurationStatus.Configuring;

        onStatusStateChange({
          id: this.id,
          status: {
            configurationStatus: this.#adapterState.configurationStatus,
          },
        });

        this.#adapterState.client.on(
          this.#adapterState.client.Event.SDK_READY,
          () => {
            let flagNames: TFlagName[];
            let flags: TFlags;

            if (
              this.#adapterState.client &&
              this.#adapterState.manager &&
              this.#adapterState.user?.key
            ) {
              flagNames = this.#adapterState.manager.names();
              flags = this.#adapterState.client.getTreatments(
                this.#adapterState.user.key,
                flagNames,
                {
                  ...this.#adapterState.user,
                  ...this.#adapterState.treatmentAttributes,
                } as SplitIO.Attributes
              );

              if (!this.#getIsAdapterUnsubscribed()) {
                onFlagsStateChange({
                  id: this.id,
                  flags: normalizeFlags(flags),
                });
              }

              // First update internal state
              this.#adapterState.configurationStatus =
                AdapterConfigurationStatus.Configured;
              // ...to then signal that the adapter is configured

              if (!this.#getIsAdapterUnsubscribed()) {
                onStatusStateChange({
                  id: this.id,
                  status: {
                    configurationStatus: this.#adapterState.configurationStatus,
                  },
                });
              }

              // ...to finally subscribe to later changes.
              this.#subscribeToFlagsChanges({
                flagNames,
                onFlagsStateChange,
              });

              resolve();
            }
          }
        );
      } else reject();
    });

  #configureSplitio = async () => {
    const { client, manager } = this.#initializeClient();

    this.#adapterState.client = client;
    this.#adapterState.manager = manager;

    return this.#subscribeToFlagChanges({
      onFlagsStateChange:
        this.#adapterState.configuredCallbacks.onFlagsStateChange,
      onStatusStateChange:
        this.#adapterState.configuredCallbacks.onStatusStateChange,
    }).then(() => ({
      initializationStatus: AdapterInitializationStatus.Succeeded,
    }));
  };

  #cloneTreatmentAttributes = <
    T = TSplitioAdapterArgs['sdk']['treatmentAttributes']
  >(
    treatmentAttributes: T
  ): T => cloneDeep<T>(treatmentAttributes);

  updateFlags() {
    console.log(
      '@flopflip/splitio-adapter: update flags it not yet implemented.'
    );
  }

  async configure(
    adapterArgs: TSplitioAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) {
    const { sdk, user } = adapterArgs;

    this.#adapterState.configurationStatus =
      AdapterConfigurationStatus.Configuring;

    this.#adapterState.user = this.#ensureUser(user);
    this.#adapterState.treatmentAttributes = this.#cloneTreatmentAttributes(
      sdk.treatmentAttributes
    );
    this.#adapterState.configuredCallbacks.onFlagsStateChange =
      adapterEventHandlers.onFlagsStateChange;
    this.#adapterState.configuredCallbacks.onStatusStateChange =
      adapterEventHandlers.onStatusStateChange;

    this.#adapterState.splitioSettings = {
      ...omit(sdk.options ?? {}, ['core']),
      core: {
        authorizationKey: sdk.authorizationKey,
        key: this.#adapterState.user?.key ?? createAnonymousUserKey(),
        ...sdk.options?.core,
      },
    };

    return this.#configureSplitio();
  }

  async reconfigure(
    adapterArgs: TSplitioAdapterArgs,
    _adapterEventHandlers: TAdapterEventHandlers
  ) {
    if (
      !this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured) ||
      !this.#adapterState.user
    ) {
      return Promise.reject(
        new Error(
          '@flopflip/splitio-adapter: please configure adapter before reconfiguring.'
        )
      );
    }

    const hasUserChanged = !isEqual(this.#adapterState.user, adapterArgs.user);
    const hasTreatmentChanged = !isEqual(
      this.#adapterState.treatmentAttributes,
      adapterArgs.sdk?.treatmentAttributes
    );

    if (hasUserChanged) {
      this.#adapterState.user = this.#ensureUser(adapterArgs.user);
    }

    if (hasTreatmentChanged) {
      this.#adapterState.treatmentAttributes = this.#cloneTreatmentAttributes(
        adapterArgs.sdk.treatmentAttributes
      );
    }

    if (
      (hasUserChanged || hasTreatmentChanged) &&
      this.#adapterState.manager &&
      this.#adapterState.client
    ) {
      await this.#adapterState.client.destroy();

      return this.#configureSplitio();
    }

    return Promise.resolve({
      initializationStatus: AdapterInitializationStatus.Succeeded,
    });
  }

  getIsConfigurationStatus(configurationStatus: AdapterConfigurationStatus) {
    return this.#adapterState.configurationStatus === configurationStatus;
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

const adapter = new SplitioAdapter();

exposeGlobally(adapter);

export default adapter;
export { createAnonymousUserKey, normalizeFlag };
