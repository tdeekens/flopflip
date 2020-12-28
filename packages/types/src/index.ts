import type { LDClient as TLDClient } from 'launchdarkly-js-client-sdk';

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
export type TAdapterStatusChange = {
  id?: TAdapterIdentifiers;
  status: Partial<TAdapterStatus>;
};
export type TFlagsChange = { id?: TAdapterIdentifiers; flags: TFlags };
export type TAdapterEventHandlers = {
  onFlagsStateChange: (flagsChange: TFlagsChange) => void;
  onStatusStateChange: (statusChange: TAdapterStatusChange) => void;
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
export type TGraphQLAdapterArgs = TBaseAdapterArgs & {
  adapterConfiguration: TGraphQLAdapterSubscriptionOptions;
  cacheIdentifier?: TCacheIdentifiers;
};
export type TGraphQLAdapterSubscriptionOptions = {
  fetcher?: typeof fetch;
  uri: string;
  query: string;
  pollingInteral?: number;
  getQueryVariables?: (adapterArgs: TGraphQLAdapterArgs) => unknown;
  getRequestHeaders?: (
    adapterArgs: TGraphQLAdapterArgs
  ) => Record<string, string>;
  parseFlags?: (fetchedFlags: unknown) => TFlags;
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
  | TSplitioAdapterArgs
  | TGraphQLAdapterArgs;
export const adapterIdentifiers = {
  launchdarkly: 'launchdarkly',
  localstorage: 'localstorage',
  memory: 'memory',
  splitio: 'splitio',
  graphql: 'graphql',
} as const;
export type TAdapterIdentifiers =
  | typeof adapterIdentifiers[keyof typeof adapterIdentifiers]
  | string;
export type TFlagsContext = Record<TAdapterIdentifiers, TFlags>;
export const cacheIdentifiers = {
  local: 'local',
  session: 'session',
} as const;
export type TCacheIdentifiers = typeof cacheIdentifiers[keyof typeof cacheIdentifiers];
export type TUpdateFlagsOptions = {
  lockFlags?: boolean;
  unsubscribeFlags?: boolean;
};
export type TFlagsUpdateFunction = (
  flags: TFlags,
  options?: TUpdateFlagsOptions
) => void;

export interface TAdapterInterface<Args extends TAdapterArgs> {
  // Identifiers are used to uniquely identify an interface when performing a condition check.
  id: TAdapterIdentifiers;
  // Used if a combined adapter intends to affect variaus other adapter's feature states
  effectIds?: TAdapterIdentifiers[];
  configure: (
    adapterArgs: Args,
    adapterEventHandlers: TAdapterEventHandlers
  ) => Promise<TAdapterConfiguration>;
  reconfigure: (
    adapterArgs: Args,
    adapterEventHandlers: TAdapterEventHandlers
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
  updateFlags: TFlagsUpdateFunction;
  getUser?: () => TUser | undefined;
}
export interface TLaunchDarklyAdapterInterface
  extends TAdapterInterface<TLaunchDarklyAdapterArgs> {
  id: typeof adapterIdentifiers.launchdarkly;
  configure: (
    adapterArgs: TLaunchDarklyAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) => Promise<TAdapterConfiguration>;
  reconfigure: (
    adapterArgs: TLaunchDarklyAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) => Promise<TAdapterConfiguration>;
  getIsConfigurationStatus: (
    adapterConfigurationStatus: AdapterConfigurationStatus
  ) => boolean;
  getClient: () => TLDClient | undefined;
  getFlag: (flagName: TFlagName) => TFlagVariation | undefined;
  updateUserContext: (updatedUserProps: TUser) => Promise<unknown>;
  unsubscribe: () => void;
  subscribe: () => void;
}
export interface TLocalStorageAdapterInterface
  extends TAdapterInterface<TLocalStorageAdapterArgs> {
  id: typeof adapterIdentifiers.localstorage;
  configure: (
    adapterArgs: TLocalStorageAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) => Promise<TAdapterConfiguration>;
  reconfigure: (
    adapterArgs: TLocalStorageAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) => Promise<TAdapterConfiguration>;
  getIsConfigurationStatus: (
    adapterConfigurationStatus: AdapterConfigurationStatus
  ) => boolean;
  waitUntilConfigured: () => Promise<unknown>;
  unsubscribe: () => void;
  subscribe: () => void;
}
export interface TGraphQLAdapterInterface
  extends TAdapterInterface<TGraphQLAdapterArgs> {
  id: typeof adapterIdentifiers.graphql;
  configure: (
    adapterArgs: TGraphQLAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) => Promise<TAdapterConfiguration>;
  reconfigure: (
    adapterArgs: TGraphQLAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
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
  id: typeof adapterIdentifiers.memory;
  configure: (
    adapterArgs: TMemoryAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) => Promise<TAdapterConfiguration>;
  reconfigure: (
    adapterArgs: TMemoryAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) => Promise<TAdapterConfiguration>;
  getIsConfigurationStatus: (
    adapterConfigurationStatus: AdapterConfigurationStatus
  ) => boolean;
  waitUntilConfigured: () => Promise<unknown>;
  reset: () => void;
  updateFlags: TFlagsUpdateFunction;
  unsubscribe: () => void;
  subscribe: () => void;
}
export interface TSplitioAdapterInterface
  extends TAdapterInterface<TSplitioAdapterArgs> {
  id: typeof adapterIdentifiers.splitio;
  configure: (
    adapterArgs: TSplitioAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) => Promise<TAdapterConfiguration>;
  reconfigure: (
    adapterArgs: TSplitioAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
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
  | TSplitioAdapterInterface
  | TGraphQLAdapterInterface;
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
  : TAdapterInstance extends TGraphQLAdapterInterface
  ? TGraphQLAdapterArgs
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
    : TAdapterInstance extends TGraphQLAdapterInterface
    ? TGraphQLAdapterInterface
    : never;
  adapterArgs: ConfigureAdapterArgs<TAdapterInstance>;
};
export type TAdapterReconfigurationOptions = {
  shouldOverwrite?: boolean;
};
export type TAdapterReconfiguration = {
  adapterArgs: TAdapterArgs;
  options: TAdapterReconfigurationOptions;
};
export type TConfigureAdapterChildrenAsFunctionArgs = {
  isAdapterConfigured: boolean;
};
export type TConfigureAdapterChildrenAsFunction = (
  args: TConfigureAdapterChildrenAsFunctionArgs
) => React.ReactNode;
export type TConfigureAdapterChildren =
  | TConfigureAdapterChildrenAsFunction
  | React.ReactNode;
export type TReconfigureAdapter = (
  adapterArgs: TAdapterArgs,
  options: TAdapterReconfigurationOptions
) => void;
export type TAdapterContext = {
  adapterEffectIdentifiers: TAdapterIdentifiers[];
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
type TGraphQLAdapterGlobal = {
  adapter: TLocalStorageAdapterInterface;
  updateFlags: TFlagsUpdateFunction;
};

export type TFlopflipGlobal = {
  [adapterIdentifiers.launchdarkly]?: TLaunchDarklyFlopflipGlobal;
  [adapterIdentifiers.splitio]?: TSplitioAdapterGlobal;
  [adapterIdentifiers.memory]?: TMemoryAdapterGlobal;
  [adapterIdentifiers.localstorage]?: TLocalStorageAdapterGlobal;
  [adapterIdentifiers.graphql]?: TGraphQLAdapterGlobal;
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
export type TCache = {
  get: (key: string) => any;
  set: (key: string, value: any) => boolean;
  unset: (key: string) => void;
};
export type TCacheOptions = {
  prefix: string;
};
