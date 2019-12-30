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
};
export type AdapterArgs =
  | LaunchDarklyAdapterArgs
  | LocalStorageAdapterArgs
  | MemoryAdapterArgs
  | SplitioAdapterArgs;
export type Adapter = {
  configure(
    adapterArgs: AdapterArgs,
    adapterEventHandlers: AdapterEventHandlers
  ): Promise<any>;
  reconfigure(
    adapterArgs: AdapterArgs,
    adapterEventHandlers: AdapterEventHandlers
  ): Promise<any>;
  getIsReady(): boolean;
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
