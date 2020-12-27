/* global SplitIO */

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
} from '@flopflip/types';
import {
  AdapterInitializationStatus,
  AdapterSubscriptionStatus,
  AdapterConfigurationStatus,
  interfaceIdentifiers,
} from '@flopflip/types';
import { normalizeFlags, exposeGlobally } from '@flopflip/adapter-utilities';

import merge from 'deepmerge';
import { SplitFactory } from '@splitsoftware/splitio';
import camelCase from 'lodash/camelCase';
import cloneDeep from 'lodash/cloneDeep';
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
  } else if (flagValue !== undefined && flagValue !== null) {
    normalizeFlagValue = flagValue;
  } else {
    normalizeFlagValue = false;
  }

  return [camelCase(flagName), normalizeFlagValue];
};

const createAnonymousUserKey = () => Math.random().toString(36).substring(2);

class SplitioAdapter implements TSplitioAdapterInterface {
  #adapterState: TAdapterStatus & SplitIOAdapterState;
  id: typeof interfaceIdentifiers.splitio;

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
    this.id = interfaceIdentifiers.splitio;
  }

  #getIsAdapterUnsubscribed = () =>
    this.#adapterState.subscriptionStatus ===
    AdapterSubscriptionStatus.Unsubscribed;

  #subscribeToFlagsChanges = ({
    flagNames,
    onFlagsStateChange,
  }: {
    flagNames: TFlagName[];
    onFlagsStateChange: TOnFlagsStateChangeCallback;
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
              onFlagsStateChange(normalizeFlags(flags));
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

  #subscribe = async ({
    onFlagsStateChange,
    onStatusStateChange,
  }: {
    onFlagsStateChange: TOnFlagsStateChangeCallback;
    onStatusStateChange: TOnStatusStateChangeCallback;
  }) =>
    new Promise<void>((resolve, reject) => {
      if (this.#adapterState.client) {
        this.#adapterState.configurationStatus =
          AdapterConfigurationStatus.Configuring;

        onStatusStateChange({
          configurationStatus: this.#adapterState.configurationStatus,
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
                onFlagsStateChange(normalizeFlags(flags));
              }

              // First update internal state
              this.#adapterState.configurationStatus =
                AdapterConfigurationStatus.Configured;
              // ...to then signal that the adapter is configured

              if (!this.#getIsAdapterUnsubscribed()) {
                onStatusStateChange({
                  configurationStatus: this.#adapterState.configurationStatus,
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

    return this.#subscribe({
      onFlagsStateChange: this.#adapterState.configuredCallbacks
        .onFlagsStateChange,
      onStatusStateChange: this.#adapterState.configuredCallbacks
        .onStatusStateChange,
    }).then(() => {
      return {
        initializationStatus: AdapterInitializationStatus.Succeeded,
      };
    });
  };

  #cloneTreatmentAttributes = <T = TSplitioAdapterArgs['treatmentAttributes']>(
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
    const {
      authorizationKey,
      user,
      options = {},
      treatmentAttributes,
    } = adapterArgs;

    this.#adapterState.configurationStatus =
      AdapterConfigurationStatus.Configuring;

    this.#adapterState.user = this.#ensureUser(user);
    this.#adapterState.treatmentAttributes = this.#cloneTreatmentAttributes(
      treatmentAttributes
    );
    this.#adapterState.configuredCallbacks.onFlagsStateChange =
      adapterEventHandlers.onFlagsStateChange;
    this.#adapterState.configuredCallbacks.onStatusStateChange =
      adapterEventHandlers.onStatusStateChange;

    this.#adapterState.splitioSettings = {
      ...omit(options, ['core']),
      core: {
        authorizationKey,
        key: this.#adapterState.user.key ?? createAnonymousUserKey(),
        ...options.core,
      },
    };

    return this.#configureSplitio();
  }

  async reconfigure(
    adapterArgs: TSplitioAdapterArgs,
    _adapterEventHandlers: TAdapterEventHandlers
  ) {
    if (
      this.#adapterState.configurationStatus !==
        AdapterConfigurationStatus.Configured ||
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
      adapterArgs.treatmentAttributes
    );

    if (hasUserChanged) {
      this.#adapterState.user = this.#ensureUser(adapterArgs.user);
    }

    if (hasTreatmentChanged) {
      this.#adapterState.treatmentAttributes = this.#cloneTreatmentAttributes(
        adapterArgs.treatmentAttributes
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
