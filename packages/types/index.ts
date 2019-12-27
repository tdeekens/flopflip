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
export type AdapterArgs = {
  user: User;
  adapterConfiguration: {
    pollingInteral: number;
  };
  flags: Flags;
};
export type AdapterArgsWithEventHandlers = AdapterArgs & AdapterEventHandlers;
export type Adapter = {
  configure(adapterArgs: AdapterArgs): Promise<any>;
  reconfigure(adapterArgs: AdapterArgs): Promise<any>;
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
  adapterArgs: AdapterArgsWithEventHandlers;
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
  adapterArgs: AdapterArgsWithEventHandlers,
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
