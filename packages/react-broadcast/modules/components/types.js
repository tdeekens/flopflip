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
