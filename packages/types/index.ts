export type FlagName = string;
export type FlagVariation = boolean | string;
export type Flag = [FlagName, FlagVariation];
export type Flags = { [key: FlagName]: FlagVariation };
export type User = {
  key?: string,
};
export type AdapterArgs = {
  user: User,
  onFlagsStateChange: () => void,
  onStatusStateChange: () => void,
  remainingArgs: {
    pollingInteral: number,
  },
};
export type AdapterStatus = {
  isReady?: boolean,
  isConfigured?: boolean,
};
export type Adapter = {
  configure: (adapterArgs: AdapterArgs) => Promise<any>,
  reconfigure: (adapterArgs: AdapterArgs) => Promise<any>,
  getIsReady: () => boolean,
};
export type AdapterStatusChange = { [key: string]: boolean }
export type OnFlagsStateChangeCallback = (flags: Flags) => void;
export type OnStatusStateChangeCallback = (statusChange: AdapterStatusChange) => void;

export type AdapterReconfigurationOptions = {
  shouldOverwrite?: boolean,
};
export type AdapterReconfiguration = {
  adapterArgs: AdapterArgs,
  options: AdapterReconfigurationOptions,
};
export type ReconfigureAdapter = (
  adapterArgs: AdapterArgs,
  options: AdapterReconfigurationOptions
) => void;
