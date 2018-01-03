export type FlagName = string;
export type FlagVariation = boolean | string;
export type Flag = [FlagName, FlagVariation];
export type Flags = { [FlagName]: FlagVariation };
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
export type Adapter = {
  configure: (adapterArgs: AdapterArgs) => Promise<any>,
  reconfigure: (adapterArgs: AdapterArgs) => Promise<any>,
};
