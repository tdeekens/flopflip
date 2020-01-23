export type FlagName = string;
export type FlagVariation = boolean | string;
export type Flag = [FlagName, FlagVariation];
export type Flags = { [key: string]: FlagVariation };
export type User = {
  key?: string;
};
export type AdapterStatus = {
  isReady?: boolean;
  isConfigured?: boolean;
};
export type AdapterEventHandlers = {
  onFlagsStateChange: (flags: Flags) => void;
  onStatusStateChange: (status: AdapterStatus) => void;
};
export type BaseAdapterArgs = {
  user: User;
};
export type LaunchDarklyAdapterArgs = BaseAdapterArgs & {
  clientSideId: string;
  flags: Flags;
  clientOptions?: { fetchGoals?: boolean };
  subscribeToFlagChanges?: boolean;
  throwOnInitializationFailure?: boolean;
  flagsUpdateDelayMs?: number;
};
export type LocalStorageAdapterArgs = BaseAdapterArgs & {
  adapterConfiguration?: {
    pollingInteral?: number;
  };
};
export type MemoryAdapterArgs = BaseAdapterArgs;
export type SplitioAdapterArgs = BaseAdapterArgs & {
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
export type AdapterArgs =
  | LaunchDarklyAdapterArgs
  | LocalStorageAdapterArgs
  | MemoryAdapterArgs
  | SplitioAdapterArgs;
export const interfaceIdentifiers = {
  launchdarkly: 'launchdarkly',
  localstorage: 'localstorage',
  memory: 'memory',
  splitio: 'splitio',
} as const;
export type AdapterInterfaceIdentifiers = typeof interfaceIdentifiers[keyof typeof interfaceIdentifiers];
export interface AdapterInterface<Args extends AdapterArgs> {
  // Identifiers are used to uniquely identify an interface when performing a condition check.
  id: AdapterInterfaceIdentifiers;
  configure(
    adapterArgs: Args,
    adapterEventHandlers: AdapterEventHandlers
  ): Promise<any>;
  reconfigure(
    adapterArgs: Args,
    adapterEventHandlers: AdapterEventHandlers
  ): Promise<any>;
  getIsReady(): boolean;
  setIsReady?(nextStatus: AdapterStatus): void;
  waitUntilConfigured?(): Promise<any>;
  reset?(): void;
  getFlag?(flagName: FlagName): FlagVariation | undefined;
}
export interface LaunchDarklyAdapterInterface
  extends AdapterInterface<LaunchDarklyAdapterArgs> {
  id: typeof interfaceIdentifiers.launchdarkly;
  configure(
    adapterArgs: LaunchDarklyAdapterArgs,
    adapterEventHandlers: AdapterEventHandlers
  ): Promise<any>;
  reconfigure(
    adapterArgs: LaunchDarklyAdapterArgs,
    adapterEventHandlers: AdapterEventHandlers
  ): Promise<any>;
  getIsReady(): boolean;
  getFlag(flagName: FlagName): FlagVariation | undefined;
  updateUserContext(updatedUserProps: User): Promise<any>;
}
export interface LocalStorageAdapterInterface
  extends AdapterInterface<LocalStorageAdapterArgs> {
  id: typeof interfaceIdentifiers.localstorage;
  configure(
    adapterArgs: LocalStorageAdapterArgs,
    adapterEventHandlers: AdapterEventHandlers
  ): Promise<any>;
  reconfigure(
    adapterArgs: LocalStorageAdapterArgs,
    adapterEventHandlers: AdapterEventHandlers
  ): Promise<any>;
  getIsReady(): boolean;
  waitUntilConfigured(): Promise<any>;
}
export interface MemoryAdapterInterface
  extends AdapterInterface<MemoryAdapterArgs> {
  id: typeof interfaceIdentifiers.memory;
  configure(
    adapterArgs: MemoryAdapterArgs,
    adapterEventHandlers: AdapterEventHandlers
  ): Promise<any>;
  reconfigure(
    adapterArgs: MemoryAdapterArgs,
    adapterEventHandlers: AdapterEventHandlers
  ): Promise<any>;
  getIsReady(): boolean;
  setIsReady(nextStatus: AdapterStatus): void;
  waitUntilConfigured(): Promise<any>;
  reset(): void;
  updateFlags(flags: Flags): void;
}
export interface SplitioAdapterInterface
  extends AdapterInterface<SplitioAdapterArgs> {
  id: typeof interfaceIdentifiers.splitio;
  configure(
    adapterArgs: SplitioAdapterArgs,
    adapterEventHandlers: AdapterEventHandlers
  ): Promise<any>;
  reconfigure(
    adapterArgs: SplitioAdapterArgs,
    adapterEventHandlers: AdapterEventHandlers
  ): Promise<any>;
  getIsReady(): boolean;
}
export type Adapter =
  | LaunchDarklyAdapterInterface
  | LocalStorageAdapterInterface
  | MemoryAdapterInterface
  | SplitioAdapterInterface;
export type ConfigureAdapterArgs<
  AdapterInstance extends Adapter
> = AdapterInstance extends LaunchDarklyAdapterInterface
  ? LaunchDarklyAdapterArgs
  : AdapterInstance extends LocalStorageAdapterInterface
  ? LocalStorageAdapterArgs
  : AdapterInstance extends MemoryAdapterInterface
  ? MemoryAdapterArgs
  : AdapterInstance extends SplitioAdapterInterface
  ? SplitioAdapterArgs
  : never;
export type ConfigureAdapterProps<AdapterInstance extends Adapter> = {
  adapter: AdapterInstance extends LaunchDarklyAdapterInterface
    ? LaunchDarklyAdapterInterface
    : AdapterInstance extends LocalStorageAdapterInterface
    ? LocalStorageAdapterInterface
    : AdapterInstance extends MemoryAdapterInterface
    ? MemoryAdapterInterface
    : AdapterInstance extends SplitioAdapterInterface
    ? SplitioAdapterInterface
    : never;
  adapterArgs: ConfigureAdapterArgs<AdapterInstance>;
};
export type AdapterStatusChange = { [key: string]: boolean };
export type OnFlagsStateChangeCallback = (flags: Flags) => void;
export type OnStatusStateChangeCallback = (
  statusChange: AdapterStatusChange
) => void;

export type AdapterReconfigurationOptions = {
  shouldOverwrite?: boolean;
};
export type AdapterReconfiguration = {
  adapterArgs: AdapterArgs;
  options: AdapterReconfigurationOptions;
};
export type ConfigureAdapterChildrenAsFunctionArgs = {
  isAdapterReady: boolean;
};
export type ConfigureAdapterChildrenAsFunction = (
  args: ConfigureAdapterChildrenAsFunctionArgs
) => React.ReactNode;
export type ConfigureAdapterChildren =
  | ConfigureAdapterChildrenAsFunction
  | React.ReactNode;
export type ReconfigureAdapter = (
  adapterArgs: AdapterArgs,
  options: AdapterReconfigurationOptions
) => void;
export type AdapterContext = {
  reconfigure: ReconfigureAdapter;
  status: AdapterStatus;
};
export type Diff<ExcludedFrom, ToExclude> = Pick<
  ExcludedFrom,
  Exclude<keyof ExcludedFrom, keyof ToExclude>
>;
