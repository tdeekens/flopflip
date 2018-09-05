// @flow
import type {
  FlagName,
  FlagVariation,
  User,
  Flag,
  Flags,
  OnFlagsStateChangeCallback,
  OnStatusStateChangeCallback,
} from '@flopflip/types';
import { SplitFactory } from '@splitsoftware/splitio';
import camelCase from 'lodash.camelcase';

type Client = {
  on: (state: string, () => void) => void,
  getTreatments: (flags: Flags, user: User) => Flags,
  Event: {
    SDK_UPDATE: string,
    SDK_READY: string,
  },
};
type Manager = {
  names: () => Flags,
};
type AdapterState = {
  isReady: boolean,
  isConfigured: boolean,
  user: ?User,
  client: ?Client,
  manager: ?Manager,
};
type ClientInitializationOptions = {
  [key: mixed]: ?mixed,
  core?: {
    [key: mixed]: ?mixed,
  },
};

const adapterState: AdapterState = {
  isReady: false,
  isConfigured: false,
  user: null,
  client: null,
  manager: null,
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

export const camelCaseFlags = (flags: Flags) =>
  Object.entries(flags).reduce((camelCasedFlags, [flagName, flaValue]) => {
    const [normalizedFlagName, normalizedFlagValue]: Flag = normalizeFlag(
      flagName,
      flaValue
    );

    camelCasedFlags[normalizedFlagName] = normalizedFlagValue;

    return camelCasedFlags;
  }, {});

const subscribeToFlagsChanges = ({
  flagNames,
  onFlagsStateChange,
}: {
  flagNames: Flags,
  onFlagsStateChange: OnFlagsStateChangeCallback,
}) => {
  if (adapterState.client) {
    adapterState.client.on(adapterState.client.Event.SDK_UPDATE, () => {
      if (adapterState.client) {
        const flags = adapterState.client.getTreatments(
          flagNames,
          adapterState.user
        );
        onFlagsStateChange(camelCaseFlags(flags));
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

// NOTE: Little helper to omit properties from an object.
// `lodash.omit` is too heavy in bundle size to add as a dependency.
const omit = (obj: {}, keys: Array<mixed>): {} =>
  Object.entries(obj)
    .filter(([key]) => !keys.includes(key))
    .reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: value,
      }),
      {}
    );

const initializeClient = (
  authorizationKey: string,
  key: string,
  options: ClientInitializationOptions = {}
): { client: Client, manager: Manager } => {
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
  onFlagsStateChange: OnFlagsStateChangeCallback,
  onStatusStateChange: OnStatusStateChangeCallback,
}): Promise<any> =>
  new Promise((resolve, reject) => {
    if (adapterState.client) {
      adapterState.client.on(adapterState.client.Event.SDK_READY, () => {
        let flagNames: Array<FlagName>;
        let flags: Flags;

        if (adapterState.manager) {
          flagNames = adapterState.manager.names();
        }
        if (adapterState.client) {
          flags = adapterState.client.getTreatments(
            flagNames,
            adapterState.user
          );
        }

        // First update internal state
        adapterState.isReady = true;
        // ...to then signal that the adapter is ready
        onStatusStateChange({ isReady: true });
        // ...and flush initial state of flags
        onFlagsStateChange(camelCaseFlags(flags));
        // ...to finally subscribe to later changes.
        subscribeToFlagsChanges({
          flagNames,
          onFlagsStateChange,
        });

        return resolve();
      });
    } else reject();
  });

const getIsReady = (): boolean => adapterState.isReady;

const configure = ({
  authorizationKey,
  user,
  options,
  onFlagsStateChange,
  onStatusStateChange,
}: {
  authorizationKey: string,
  user: User,
  options: ClientInitializationOptions,
  onFlagsStateChange: OnFlagsStateChangeCallback,
  onStatusStateChange: OnStatusStateChangeCallback,
}): Promise<any> => {
  adapterState.user = ensureUser(user);
  const { client, manager } = initializeClient(
    authorizationKey,
    adapterState.user.key,
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
  user: User,
  onFlagsStateChange: OnFlagsStateChangeCallback,
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
      let flagNames: Array<FlagName>;
      let flags: Flags;

      adapterState.user = ensureUser(user);

      if (adapterState.manager) {
        flagNames = adapterState.manager.names();
      }
      if (adapterState.client) {
        flags = adapterState.client.getTreatments(flagNames, adapterState.user);
      }

      onFlagsStateChange(camelCaseFlags(flags));
    }

    return resolve();
  });

export default {
  getIsReady,
  configure,
  reconfigure,
};
