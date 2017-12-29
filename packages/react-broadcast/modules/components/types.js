export type FlagName = string;
export type FlagVariation = boolean | string;
export type Flag = [FlagName, FlagVariation];
export type Flags = { [FlagName]: FlagVariation };
export type Adapter = {
  configure: AdapterArgs => Promise<any>,
  reconfigure: AdapterArgs => Promise<any>,
};
export type AdapterArgs = {
  user: {
    key?: string,
  },
  onFlagsStateChange: () => void,
  onStatusStateChange: () => void,
};
export type AdapterStatus = {
  isReady?: boolean,
  isConfigured?: boolean,
};
