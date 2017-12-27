export type FlagValue = boolean | string;
export type FlagName = string;
export type User = {
  key: string,
};
export type Client = {
  identify: (nextUser: User) => void,
  on: (state: string, () => void) => void,
  on: (state: string, (flagName: FlagName) => void) => void,
  allFlags: () => Flags | null,
};
export type AdapterState = {
  isReady: boolean,
  isConfigured: boolean,
  user: ?User,
  client: ?Client,
};
export type Flag = [FlagName, FlagValue];
export type Flags = { [FlagName]: FlagValue };
export type OnFlagsStateChangeCallback = Flags => void;
export type OnStatusStateChangeCallback = ({ [string]: boolean }) => void;
