export type FlagName = string;
export type FlagVariation = boolean | string;
export type Flag = [FlagName, FlagVariation];
export type Flags = { [key: string]: FlagVariation };
export type User = {
  key?: string;
};
export type AdapterArgs = {
  user: User;
  onFlagsStateChange: (flags: Flags) => void;
  onStatusStateChange: (status: AdapterStatus) => void;
  adapterConfiguration: {
    pollingInteral: number;
  };
};
export type AdapterStatus = {
  isReady?: boolean;
  isConfigured?: boolean;
};
export type Adapter = {
  configure: (adapterArgs: AdapterArgs) => Promise<any>;
  reconfigure: (adapterArgs: AdapterArgs) => Promise<any>;
  getIsReady: () => boolean;
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
export type ConfigureAdapterChildren = ({
  isAdapterReady: boolean,
}) => React.ReactNode | React.ReactNode | null;
export type ReconfigureAdapter = (
  adapterArgs: AdapterArgs,
  options: AdapterReconfigurationOptions
) => void;

export type Diff<ExcludedFrom, ToExclude> = Pick<
  ExcludedFrom,
  Exclude<keyof ExcludedFrom, keyof ToExclude>
>;
