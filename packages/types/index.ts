import { LDClient as TLDClient } from 'launchdarkly-js-client-sdk';

export type TFlagName = string;
export type TFlagVariation = boolean | string;
export type TFlag = [TFlagName, TFlagVariation];
export type TFlags = { [key: string]: TFlagVariation };
export type TUser = {
  key?: string;
};
export enum TAdapterSubscriptionStatus {
  Subscribed,
  Unsubscribed,
}
export enum TAdapterConfigurationStatus {
  Unconfigured,
  Configuring,
  Configured,
}
export type TAdapterStatus = {
  configurationStatus: TAdapterConfigurationStatus;
  subscriptionStatus: TAdapterSubscriptionStatus;
};
export type TAdapterStatusChange = Partial<TAdapterStatus>;
export type TFlagsChange = TFlags;
export type TAdapterEventHandlers = {
  onFlagsStateChange: (flags: TFlagsChange) => void;
  onStatusStateChange: (status: TAdapterStatusChange) => void;
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
export type TLocalStorageAdapterArgs = TBaseAdapterArgs & {
  adapterConfiguration?: {
    pollingInteral?: number;
  };
};
export type TMemoryAdapterArgs = TBaseAdapterArgs;
export type TSplitioAdapterArgs = TBaseAdapterArgs & {
  authorizationKey: string;
  options?: {
    [key: string]: unknown;
    core?: {
      [key: string]: string;
    };
  };
  treatmentAttributes?: {
    // Matches the signature of SplitIO.Attributes
    [key: string]: string | number | boolean | Array<string | number>;
  };
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
  configure(
    adapterArgs: Args,
    adapterEventHandlers: TAdapterEventHandlers
  ): Promise<unknown>;
  reconfigure(
    adapterArgs: Args,
    adapterEventHandlers: TAdapterEventHandlers
  ): Promise<unknown>;
  getIsConfigurationStatus(
    configurationStatus: TAdapterConfigurationStatus
  ): boolean;
  setConfigurationStatus?(
    nextConfigurationStatus: TAdapterConfigurationStatus
  ): void;
  waitUntilConfigured?(): Promise<unknown>;
  reset?(): void;
  getFlag?(flagName: TFlagName): TFlagVariation | undefined;
  unsubscribe(): void;
  subscribe(): void;
}
export interface TLaunchDarklyAdapterInterface
  extends TAdapterInterface<TLaunchDarklyAdapterArgs> {
  id: typeof interfaceIdentifiers.launchdarkly;
  configure(
    adapterArgs: TLaunchDarklyAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ): Promise<unknown>;
  reconfigure(
    adapterArgs: TLaunchDarklyAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ): Promise<unknown>;
  getIsConfigurationStatus(
    adapterConfigurationStatus: TAdapterConfigurationStatus
  ): boolean;
  getClient(): TLDClient | undefined;
  getFlag(flagName: TFlagName): TFlagVariation | undefined;
  updateUserContext(updatedUserProps: TUser): Promise<unknown>;
  unsubscribe(): void;
  subscribe(): void;
}
export interface TLocalStorageAdapterInterface
  extends TAdapterInterface<TLocalStorageAdapterArgs> {
  id: typeof interfaceIdentifiers.localstorage;
  configure(
    adapterArgs: TLocalStorageAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ): Promise<unknown>;
  reconfigure(
    adapterArgs: TLocalStorageAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ): Promise<unknown>;
  getIsConfigurationStatus(
    adapterConfigurationStatus: TAdapterConfigurationStatus
  ): boolean;
  waitUntilConfigured(): Promise<unknown>;
  unsubscribe(): void;
  subscribe(): void;
}
export interface TMemoryAdapterInterface
  extends TAdapterInterface<TMemoryAdapterArgs> {
  id: typeof interfaceIdentifiers.memory;
  configure(
    adapterArgs: TMemoryAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ): Promise<unknown>;
  reconfigure(
    adapterArgs: TMemoryAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ): Promise<unknown>;
  getIsConfigurationStatus(
    adapterConfigurationStatus: TAdapterConfigurationStatus
  ): boolean;
  waitUntilConfigured(): Promise<unknown>;
  reset(): void;
  updateFlags(flags: TFlags): void;
  unsubscribe(): void;
  subscribe(): void;
}
export interface TSplitioAdapterInterface
  extends TAdapterInterface<TSplitioAdapterArgs> {
  id: typeof interfaceIdentifiers.splitio;
  configure(
    adapterArgs: TSplitioAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ): Promise<unknown>;
  reconfigure(
    adapterArgs: TSplitioAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ): Promise<unknown>;
  getIsConfigurationStatus(
    adapterConfigurationStatus: TAdapterConfigurationStatus
  ): boolean;
  unsubscribe(): void;
  subscribe(): void;
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
export type TOnFlagsStateChangeCallback = (flags: TFlags) => void;
export type TOnStatusStateChangeCallback = (
  statusChange: TAdapterStatusChange
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
  reconfigure: TReconfigureAdapter;
  status: TAdapterStatus;
};
export type TDiff<ExcludedFrom, ToExclude> = Pick<
  ExcludedFrom,
  Exclude<keyof ExcludedFrom, keyof ToExclude>
>;
