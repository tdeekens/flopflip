import {
  FlagName,
  FlagVariation,
  User,
  Flag,
  Flags,
  OnFlagsStateChangeCallback,
  OnStatusStateChangeCallback,
  AdapterEventHandlers,
  SplitioAdapterInterface,
  SplitioAdapterArgs,
  interfaceIdentifiers,
} from '@flopflip/types';
import merge from 'deepmerge';
import { SplitFactory } from '@splitsoftware/splitio';
import camelCase from 'lodash/camelCase';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';

type AdapterState = {
  isReady: boolean;
  isConfigured: boolean;
  user?: User;
  client?: SplitIO.IClient;
  manager?: SplitIO.IManager;
  configuredCallbacks: {
    onFlagsStateChange: OnFlagsStateChangeCallback;
    onStatusStateChange: OnStatusStateChangeCallback;
  };
  splitioSettings?: SplitIO.IBrowserSettings;
};

const adapterState: AdapterState = {
  isReady: false,
  isConfigured: false,
  user: undefined,
  client: undefined,
  manager: undefined,
  configuredCallbacks: {
    onFlagsStateChange: () => undefined,
    onStatusStateChange: () => undefined,
  },
  splitioSettings: undefined,
};

export const normalizeFlag = (
  flagName: FlagName,
  flagValue: FlagVariation
): Flag => {
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

export const normalizeFlags = (flags: Flags): Flags =>
  Object.entries(flags).reduce<Flags>(
    (normalizedFlags: Flags, [flagName, flaValue]) => {
      const [normalizedFlagName, normalizedFlagValue]: Flag = normalizeFlag(
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
  flagNames: FlagName[];
  onFlagsStateChange: OnFlagsStateChangeCallback;
}): void => {
  if (adapterState.client) {
    adapterState.client.on(adapterState.client.Event.SDK_UPDATE, () => {
      if (adapterState.client) {
        const flags = adapterState.client.getTreatments(
          flagNames,
          adapterState.user as SplitIO.Attributes
        );

        onFlagsStateChange(normalizeFlags(flags));
      }
    });
  }
};

export const createAnonymousUserKey = (): string =>
  Math.random()
    .toString(36)
    .substring(2);

const ensureUser = (user: User): User =>
  merge(user, { key: user?.key ?? createAnonymousUserKey() });

const initializeClient = (): {
  client: SplitIO.IClient;
  manager: SplitIO.IManager;
} => {
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
  onFlagsStateChange: OnFlagsStateChangeCallback;
  onStatusStateChange: OnStatusStateChangeCallback;
}): Promise<any> =>
  new Promise((resolve, reject) => {
    if (adapterState.client) {
      adapterState.client.on(adapterState.client.Event.SDK_READY, () => {
        let flagNames: FlagName[];
        let flags: Flags;

        if (adapterState.client && adapterState.manager) {
          flagNames = adapterState.manager.names();
          flags = adapterState.client.getTreatments(
            flagNames,
            adapterState.user as SplitIO.Attributes
          );

          onFlagsStateChange(normalizeFlags(flags));

          // First update internal state
          adapterState.isReady = true;
          // ...to then signal that the adapter is ready
          onStatusStateChange({ isReady: true });

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
    adapterState.isConfigured = true;
    return adapterState.client;
  });
};

class SplitioAdapter implements SplitioAdapterInterface {
  id: typeof interfaceIdentifiers.splitio;

  constructor() {
    this.id = interfaceIdentifiers.splitio;
  }

  configure(
    adapterArgs: SplitioAdapterArgs,
    adapterEventHandlers: AdapterEventHandlers
  ): Promise<any> {
    const { authorizationKey, user, options = {} } = adapterArgs;

    adapterState.user = ensureUser(user);
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
    adapterArgs: SplitioAdapterArgs,
    _adapterEventHandlers: AdapterEventHandlers
  ): Promise<any> {
    if (
      !adapterState.isReady ||
      !adapterState.isConfigured ||
      !adapterState.user
    ) {
      return Promise.reject(
        new Error(
          '@flopflip/splitio-adapter: please configure adapter before reconfiguring.'
        )
      );
    }

    if (!isEqual(adapterState.user, adapterArgs.user)) {
      adapterState.user = ensureUser(adapterArgs.user);

      if (adapterState.manager && adapterState.client) {
        adapterState.client.destroy();
      }

      return configureSplitio();
    }

    return Promise.resolve();
  }

  getIsReady(): boolean {
    return Boolean(adapterState.isReady);
  }
}

const adapter = new SplitioAdapter();
export default adapter;
