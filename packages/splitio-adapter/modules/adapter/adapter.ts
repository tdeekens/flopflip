import {
  FlagName,
  FlagVariation,
  User,
  Flag,
  Flags,
  OnFlagsStateChangeCallback,
  OnStatusStateChangeCallback,
} from '@flopflip/types';
import { SplitFactory } from '@splitsoftware/splitio';
import camelCase from 'lodash/camelCase';
import omit from 'lodash/omit';

type AdapterState = {
  isReady: boolean;
  isConfigured: boolean;
  user?: User;
  client?: SplitIO.IAsyncClient;
  manager?: SplitIO.IAsyncManager;
};
type ClientInitializationOptions = {
  [key: string]: any;
  core?: {
    [key: string]: string;
  };
};

const adapterState: AdapterState = {
  isReady: false,
  isConfigured: false,
  user: undefined,
  client: undefined,
  manager: undefined,
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

export const camelCaseFlags = (flags: Flags): Flags =>
  Object.entries(flags).reduce<Flags>(
    (camelCasedFlags: Flags, [flagName, flaValue]) => {
      const [normalizedFlagName, normalizedFlagValue]: Flag = normalizeFlag(
        flagName,
        flaValue
      );

      camelCasedFlags[normalizedFlagName] = normalizedFlagValue;

      return camelCasedFlags;
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
        adapterState.client
          .getTreatments(flagNames, adapterState.user as SplitIO.Attributes)
          .then(flags => {
            onFlagsStateChange(camelCaseFlags(flags));
          });
      }
    });
  }
};

export const createAnonymousUserKey = (): string =>
  Math.random()
    .toString(36)
    .substring(2);

const ensureUser = (user: User): User => ({
  key: user && user.key ? user.key : createAnonymousUserKey(),
  ...user,
});

const initializeClient = (
  authorizationKey: string,
  key: string,
  options: ClientInitializationOptions = {}
): { client: SplitIO.IAsyncClient; manager: SplitIO.IAsyncManager } => {
  // eslint-disable-next-line new-cap
  const sdk = SplitFactory({
    ...omit(options, ['core']),
    core: {
      authorizationKey,
      key,
      ...options.core,
    },
  });

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
        if (adapterState.client && adapterState.manager) {
          // First update internal state
          adapterState.isReady = true;
          // ...to then signal that the adapter is ready
          onStatusStateChange({ isReady: true });

          flagNames = adapterState.manager.names();
          adapterState.client
            .getTreatments(flagNames, adapterState.user as SplitIO.Attributes)
            .then(flags => {
              // ...and flush initial state of flags
              onFlagsStateChange(camelCaseFlags(flags));
              // ...to finally subscribe to later changes.
              subscribeToFlagsChanges({
                flagNames,
                onFlagsStateChange,
              });

              return resolve();
            });
        }
      });
    } else reject();
  });

const getIsReady = (): boolean => Boolean(adapterState.isReady);

const configure = ({
  authorizationKey,
  user,
  options,
  onFlagsStateChange,
  onStatusStateChange,
}: {
  authorizationKey: string;
  user: User;
  options: ClientInitializationOptions;
  onFlagsStateChange: OnFlagsStateChangeCallback;
  onStatusStateChange: OnStatusStateChangeCallback;
}): Promise<any> => {
  adapterState.user = ensureUser(user);
  const { client, manager } = initializeClient(
    authorizationKey,
    adapterState.user.key || createAnonymousUserKey(),
    options
  );
  adapterState.client = client;
  adapterState.manager = manager;

  return subscribe({
    onFlagsStateChange,
    onStatusStateChange,
  }).then(() => {
    adapterState.isConfigured = true;

    return adapterState.client;
  });
};

const reconfigure = ({
  user,
  onFlagsStateChange,
}: {
  user: User;
  onFlagsStateChange: OnFlagsStateChangeCallback;
}): Promise<any> =>
  new Promise((resolve, reject) => {
    if (
      !adapterState.isReady ||
      !adapterState.isConfigured ||
      !adapterState.user
    )
      return reject(
        new Error(
          '@flopflip/splitio-adapter: please configure adapter before reconfiguring.'
        )
      );
    if (adapterState.user && adapterState.user.key !== user.key) {
      let flagNames: FlagName[];

      adapterState.user = ensureUser(user);

      if (adapterState.manager && adapterState.client) {
        flagNames = adapterState.manager.names();
        adapterState.client
          .getTreatments(flagNames, adapterState.user as SplitIO.Attributes)
          .then(flags => {
            onFlagsStateChange(camelCaseFlags(flags));
          });
      }
    }

    return resolve();
  });

export default {
  getIsReady,
  configure,
  reconfigure,
};
