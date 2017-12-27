// @flow

import { initialize } from 'ldclient-js';
import camelCase from 'lodash.camelcase';

type FlagValue = boolean | string;
type FlagName = string;
type User = {
  key: string,
};
type Client = {
  identify: (nextUser: User) => void,
  on: (state: string, () => void) => void,
  on: (state: string, (flagName: FlagName) => void) => void,
  allFlags: () => Flags | null,
};
type AdapterState = {
  isReady: boolean,
  isConfigured: boolean,
  user: ?User,
  client: ?Client,
};
type Flag = [FlagName, FlagValue];
type Flags = { [FlagName]: FlagValue };
type OnFlagsStateChangeCallback = Flags => void;
type OnStatusStateChangeCallback = ({ [string]: boolean }) => void;

const adapterState: AdapterState = {
  isReady: false,
  isConfigured: false,
  user: null,
  client: null,
};

const normalizeFlag = (flagName: FlagName, flagValue?: FlagValue): Flag => [
  camelCase(flagName),
  // Multi variate flags contain a string or `null` - `false` seems more natural.
  flagValue === null || flagValue === undefined ? false : flagValue,
];

const subscribeToFlagsChanges = ({
  rawFlags,
  onFlagsStateChange,
}: {
  rawFlags: Flags,
  onFlagsStateChange: OnFlagsStateChangeCallback,
}) => {
  for (const flagName in rawFlags) {
    // Dispatch whenever a configured flag value changes
    if (
      Object.prototype.hasOwnProperty.call(rawFlags, flagName) &&
      adapterState.client
    ) {
      adapterState.client.on(`change:${flagName}`, flagValue => {
        const [normalzedFlagName, normalzedFlagValue] = normalizeFlag(
          flagName,
          flagValue
        );

        onFlagsStateChange({
          [normalzedFlagName]: normalzedFlagValue,
        });
      });
    }
  }
};

// NOTE: Exported for testing only
export const createAnonymousUserKey = (): string =>
  Math.random()
    .toString(36)
    .substring(2);

const ensureUser = (user: User): User => ({
  key: user && user.key ? user.key : createAnonymousUserKey(),
  ...user,
});
const initializeClient = (clientSideId: string, user: User): Client =>
  initialize(clientSideId, user);
const changeUserContext = (nextUser: User): void =>
  adapterState.client && adapterState.client.identify
    ? adapterState.client.identify(nextUser)
    : undefined;

// NOTE: Exported for testing only
function entries<T>(obj: { [string]: T }): Array<[string, T]> {
  const keys: string[] = Object.keys(obj);
  return keys.map(key => [key, obj[key]]);
}
export const camelCaseFlags = (rawFlags: Flags): Flags =>
  entries(rawFlags).reduce((camelCasedFlags, [flagName, flagValue]) => {
    const [normalzedFlagName, normalzedFlagValue]: Flag = normalizeFlag(
      flagName,
      flagValue
    );
    // Can't return expression as it is the assigned value
    camelCasedFlags[normalzedFlagName] = normalzedFlagValue;

    return camelCasedFlags;
  }, {});

const subscribe = ({
  onFlagsStateChange,
  onStatusStateChange,
}: {
  onFlagsStateChange: OnFlagsStateChangeCallback,
  onStatusStateChange: OnStatusStateChangeCallback,
}): Promise<any> =>
  new Promise((resolve, reject) => {
    if (adapterState.client) {
      adapterState.client.on('ready', () => {
        const rawFlags = adapterState.client
          ? adapterState.client.allFlags()
          : null;
        // First update internal state
        adapterState.isReady = true;
        // ...to then signal that the adapter is ready
        onStatusStateChange({ isReady: true });
        if (rawFlags) {
          // ...and flush initial state of flags
          onFlagsStateChange(camelCaseFlags(rawFlags));
          // ...to finally subscribe to later changes.
          subscribeToFlagsChanges({
            rawFlags,
            onFlagsStateChange,
          });
        }

        return resolve();
      });
    } else {
      reject(new Error('Can not subscribte with non initialized client.'));
    }
  });

const configure = ({
  clientSideId,
  user,
  onFlagsStateChange,
  onStatusStateChange,
}: {
  clientSideId: string,
  user: User,
  onFlagsStateChange: OnFlagsStateChangeCallback,
  onStatusStateChange: OnStatusStateChangeCallback,
}): Promise<any> => {
  adapterState.user = ensureUser(user);
  adapterState.client = initializeClient(clientSideId, adapterState.user);

  return subscribe({
    onFlagsStateChange,
    onStatusStateChange,
  }).then(() => {
    adapterState.isConfigured = true;

    return adapterState.client;
  });
};

const reconfigure = ({
  clientSideId,
  user,
  onFlagsStateChange,
  onStatusStateChange,
}: {
  clientSideId: string,
  user: User,
  onFlagsStateChange: OnFlagsStateChangeCallback,
  onStatusStateChange: OnStatusStateChangeCallback,
}): Promise<any> =>
  new Promise((resolve, reject) => {
    if (
      !adapterState.isReady ||
      !adapterState.isConfigured ||
      !adapterState.user
    )
      return reject(
        new Error(
          '@flopflip/launchdarkly-adapter: please configure adapter before reconfiguring.'
        )
      );

    if (adapterState.user.key !== user.key) {
      adapterState.user = ensureUser(user);
      changeUserContext(adapterState.user);
    }

    resolve();
  });

export default {
  configure,
  reconfigure,
};
