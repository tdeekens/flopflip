import type { LDClient as TLDClient } from 'launchdarkly-js-client-sdk';
import type { DeepReadonly } from 'ts-essentials';

export type TFlagName = string;
export type TFlagVariation = boolean | string;
export type TFlag = [flagName: TFlagName, flagVariation: TFlagVariation];
export type TFlags = Record<string, TFlagVariation>;
export type TUser = {
  key?: string;
};
export enum AdapterSubscriptionStatus {
  Subscribed,
  Unsubscribed,
}
export enum AdapterConfigurationStatus {
  Unconfigured,
  Configuring,
  Configured,
}
export enum AdapterInitializationStatus {
  Succeeded,
  Failed,
}
export type TAdapterConfiguration = {
  initializationStatus?: AdapterInitializationStatus;
};
export type TAdapterStatus = {
  configurationStatus: AdapterConfigurationStatus;
  subscriptionStatus: AdapterSubscriptionStatus;
};
export type TAdapterStatusChange = Partial<TAdapterStatus>;
export type TFlagsChange = TFlags;
export type TAdapterEventHandlers = {
  onFlagsStateChange: (flags: Readonly<TFlagsChange>) => void;
  onStatusStateChange: (status: Readonly<TAdapterStatusChange>) => void;
};
export type TBaseAdapterArgs = {
  user: TUser;
};
export type TLaunchDarklyAdapterArgs = TBaseAdapterArgs & {
  clientSideId: string;
  flags: TFlags;
  clientOptions?: { fetchGoals?: boolean };
  subscribeToFlagChanges?: boolean;
  throwOnInitializationFailure?: boolean;
  flagsUpdateDelayMs?: number;
};
export type TLocalStorageAdapterSubscriptionOptions = {
  pollingInteral?: number;
};
export type TLocalStorageAdapterArgs = TBaseAdapterArgs & {
  adapterConfiguration?: TLocalStorageAdapterSubscriptionOptions;
};
export type TMemoryAdapterArgs = TBaseAdapterArgs;
export type TSplitioAdapterArgs = TBaseAdapterArgs & {
  authorizationKey: string;
  options?: Record<string, unknown> & { core?: Record<string, string> };
  // Matches the signature of SplitIO.Attributes
  treatmentAttributes?: Record<
    string,
    string | number | boolean | Array<string | number>
  >;
};
export type TAdapterArgs =
  | TLaunchDarklyAdapterArgs
  | TLocalStorageAdapterArgs
  | TMemoryAdapterArgs
  | TSplitioAdapterArgs;
export const interfaceIdentifiers = {
  launchdarkly: 'launchdarkly',
  localstorage: 'localstorage',
  memory: 'memory',
  splitio: 'splitio',
} as const;
export type TAdapterInterfaceIdentifiers = typeof interfaceIdentifiers[keyof typeof interfaceIdentifiers];

export interface TAdapterInterface<Args extends TAdapterArgs> {
  // Identifiers are used to uniquely identify an interface when performing a condition check.
  id: TAdapterInterfaceIdentifiers;
  configure: (
    adapterArgs: DeepReadonly<Args>,
    adapterEventHandlers: DeepReadonly<TAdapterEventHandlers>
  ) => Promise<TAdapterConfiguration>;
  reconfigure: (
    adapterArgs: DeepReadonly<Args>,
    adapterEventHandlers: DeepReadonly<TAdapterEventHandlers>
  ) => Promise<TAdapterConfiguration>;
  getIsConfigurationStatus: (
    configurationStatus: AdapterConfigurationStatus
  ) => boolean;
  setConfigurationStatus?: (
    nextConfigurationStatus: AdapterConfigurationStatus
  ) => void;
  waitUntilConfigured?: () => Promise<unknown>;
  reset?: () => void;
  getFlag?: (flagName: TFlagName) => TFlagVariation | undefined;
  unsubscribe: () => void;
  subscribe: () => void;
}
export interface TLaunchDarklyAdapterInterface
  extends TAdapterInterface<TLaunchDarklyAdapterArgs> {
  id: typeof interfaceIdentifiers.launchdarkly;
  configure: (
    adapterArgs: DeepReadonly<TLaunchDarklyAdapterArgs>,
    adapterEventHandlers: DeepReadonly<TAdapterEventHandlers>
  ) => Promise<TAdapterConfiguration>;
  reconfigure: (
    adapterArgs: DeepReadonly<TLaunchDarklyAdapterArgs>,
    adapterEventHandlers: DeepReadonly<TAdapterEventHandlers>
  ) => Promise<TAdapterConfiguration>;
  getIsConfigurationStatus: (
    adapterConfigurationStatus: AdapterConfigurationStatus
  ) => boolean;
  getClient: () => TLDClient | undefined;
  getFlag: (flagName: TFlagName) => TFlagVariation | undefined;
  updateUserContext: (updatedUserProps: Readonly<TUser>) => Promise<unknown>;
  unsubscribe: () => void;
  subscribe: () => void;
}
export interface TLocalStorageAdapterInterface
  extends TAdapterInterface<TLocalStorageAdapterArgs> {
  id: typeof interfaceIdentifiers.localstorage;
  configure: (
    adapterArgs: DeepReadonly<TLocalStorageAdapterArgs>,
    adapterEventHandlers: DeepReadonly<TAdapterEventHandlers>
  ) => Promise<TAdapterConfiguration>;
  reconfigure: (
    adapterArgs: DeepReadonly<TLocalStorageAdapterArgs>,
    adapterEventHandlers: DeepReadonly<TAdapterEventHandlers>
  ) => Promise<TAdapterConfiguration>;
  getIsConfigurationStatus: (
    adapterConfigurationStatus: AdapterConfigurationStatus
  ) => boolean;
  waitUntilConfigured: () => Promise<unknown>;
  unsubscribe: () => void;
  subscribe: () => void;
}
export interface TMemoryAdapterInterface
  extends TAdapterInterface<TMemoryAdapterArgs> {
  id: typeof interfaceIdentifiers.memory;
  configure: (
    adapterArgs: DeepReadonly<TMemoryAdapterArgs>,
    adapterEventHandlers: DeepReadonly<TAdapterEventHandlers>
  ) => Promise<TAdapterConfiguration>;
  reconfigure: (
    adapterArgs: DeepReadonly<TMemoryAdapterArgs>,
    adapterEventHandlers: DeepReadonly<TAdapterEventHandlers>
  ) => Promise<TAdapterConfiguration>;
  getIsConfigurationStatus: (
    adapterConfigurationStatus: AdapterConfigurationStatus
  ) => boolean;
  waitUntilConfigured: () => Promise<unknown>;
  reset: () => void;
  updateFlags: (flags: Readonly<TFlags>) => void;
  unsubscribe: () => void;
  subscribe: () => void;
}
export interface TSplitioAdapterInterface
  extends TAdapterInterface<TSplitioAdapterArgs> {
  id: typeof interfaceIdentifiers.splitio;
  configure: (
    adapterArgs: DeepReadonly<TSplitioAdapterArgs>,
    adapterEventHandlers: DeepReadonly<TAdapterEventHandlers>
  ) => Promise<TAdapterConfiguration>;
  reconfigure: (
    adapterArgs: DeepReadonly<TSplitioAdapterArgs>,
    adapterEventHandlers: DeepReadonly<TAdapterEventHandlers>
  ) => Promise<TAdapterConfiguration>;
  getIsConfigurationStatus: (
    adapterConfigurationStatus: AdapterConfigurationStatus
  ) => boolean;
  unsubscribe: () => void;
  subscribe: () => void;
}
export type TAdapter =
  | TLaunchDarklyAdapterInterface
  | TLocalStorageAdapterInterface
  | TMemoryAdapterInterface
  | TSplitioAdapterInterface;
export type ConfigureAdapterArgs<
  TAdapterInstance extends TAdapter
> = TAdapterInstance extends TLaunchDarklyAdapterInterface
  ? TLaunchDarklyAdapterArgs
  : TAdapterInstance extends TLocalStorageAdapterInterface
  ? TLocalStorageAdapterArgs
  : TAdapterInstance extends TMemoryAdapterInterface
  ? TMemoryAdapterArgs
  : TAdapterInstance extends TSplitioAdapterInterface
  ? TSplitioAdapterArgs
  : never;
export type TConfigureAdapterProps<TAdapterInstance extends TAdapter> = {
  adapter: TAdapterInstance extends TLaunchDarklyAdapterInterface
    ? TLaunchDarklyAdapterInterface
    : TAdapterInstance extends TLocalStorageAdapterInterface
    ? TLocalStorageAdapterInterface
    : TAdapterInstance extends TMemoryAdapterInterface
    ? TMemoryAdapterInterface
    : TAdapterInstance extends TSplitioAdapterInterface
    ? TSplitioAdapterInterface
    : never;
  adapterArgs: ConfigureAdapterArgs<TAdapterInstance>;
};
export type TOnFlagsStateChangeCallback = (flags: Readonly<TFlags>) => void;
export type TOnStatusStateChangeCallback = (
  statusChange: Readonly<TAdapterStatusChange>
) => void;
export type TUpdateFlagsOptions = {
  lockFlags?: boolean;
  unsubscribeFlags?: boolean;
};
export type TFlagsUpdateFunction = (
  flags: Readonly<TFlags>,
  options?: TUpdateFlagsOptions
) => void;
export type TAdapterReconfigurationOptions = {
  shouldOverwrite?: boolean;
};
export type TAdapterReconfiguration = {
  adapterArgs: TAdapterArgs;
  options: TAdapterReconfigurationOptions;
};
export type TConfigureAdapterChildrenAsFunctionArgs = {
  isAdapterReady?: boolean;
  isAdapterConfigured: boolean;
};
export type TConfigureAdapterChildrenAsFunction = (
  args: Readonly<TConfigureAdapterChildrenAsFunctionArgs>
) => JSX.Element;
export type TConfigureAdapterChildren =
  | TConfigureAdapterChildrenAsFunction
  | JSX.Element;
export type TReconfigureAdapter = (
  adapterArgs: TAdapterArgs,
  options: Readonly<TAdapterReconfigurationOptions>
) => void;
export type TAdapterContext = {
  reconfigure: TReconfigureAdapter;
  status: TAdapterStatus;
};

type TLaunchDarklyFlopflipGlobal = {
  adapter: TLaunchDarklyAdapterInterface;
  updateFlags: TFlagsUpdateFunction;
};
type TSplitioAdapterGlobal = {
  adapter: TSplitioAdapterInterface;
  updateFlags: TFlagsUpdateFunction;
};
type TMemoryAdapterGlobal = {
  adapter: TMemoryAdapterInterface;
  updateFlags: TFlagsUpdateFunction;
};
type TLocalStorageAdapterGlobal = {
  adapter: TLocalStorageAdapterInterface;
  updateFlags: TFlagsUpdateFunction;
};

export type TFlopflipGlobal = {
  [interfaceIdentifiers.launchdarkly]?: TLaunchDarklyFlopflipGlobal;
  [interfaceIdentifiers.splitio]?: TSplitioAdapterGlobal;
  [interfaceIdentifiers.memory]?: TMemoryAdapterGlobal;
  [interfaceIdentifiers.localstorage]?: TLocalStorageAdapterGlobal;
};
declare global {
  interface Window {
    __flopflip__: TFlopflipGlobal;
  }
}

export type TDiff<ExcludedFrom, ToExclude> = Pick<
  ExcludedFrom,
  Exclude<keyof ExcludedFrom, keyof ToExclude>
>;
