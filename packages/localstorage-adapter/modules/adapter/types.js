export type User = {
  key: string,
};
export type OnFlagsStateChangeCallback = Flags => void;
export type OnStatusStateChangeCallback = ({ [string]: boolean }) => void;
export type AdapterState = {
  onFlagsStateChange: OnFlagsStateChangeCallback,
  onStatusStateChange: OnStatusStateChangeCallback,
};
export type ConfigurationArgs = {
  user: User,
  onFlagsStateChange: OnFlagsStateChangeCallback,
  onStatusStateChange: OnStatusStateChangeCallback,
  remainingArgs: {
    pollingInteral: number,
  },
};
export type Storage = {
  get: (key: string) => string,
  set: (key: string, value: mixed) => boolean,
  unset: (key: string) => void,
};
export type Flags = { [FlagName]: FlagValue };
