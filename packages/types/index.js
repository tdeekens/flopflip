export type FlagName = string;
export type FlagVariation = boolean | string;
export type Flag = [FlagName, FlagVariation];
export type Flags = { [FlagName]: FlagVariation };
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
};
export type OnFlagsStateChangeCallback = Flags => void;
export type OnStatusStateChangeCallback = ({ [string]: boolean }) => void;

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
