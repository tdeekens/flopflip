export type FlagName = string;
export type FlagVariation = boolean | string;
export type Flag = [FlagName, FlagVariation];
export type Flags = { [FlagName]: FlagVariation };
export type AdapterArgs = {
  user: {
    key?: string,
  },
};
export type AdapterStatus = {
  isReady?: boolean,
  isConfigured?: boolean,
};
export type Adapter = {
  configure: AdapterArgs => Promise<any>,
  reconfigure: AdapterArgs => Promise<any>,
};
type State = {
  +flags: Flags,
  +status: AdapterStatus,
};
