export type User = {
  key: string,
};
export type Flags = { [FlagName]: FlagValue };
export type ConfigurationArgs = {
  user: User,
  onFlagsStateChange: OnFlagsStateChangeCallback,
  onStatusStateChange: OnStatusStateChangeCallback,
};
export type OnFlagsStateChangeCallback = Flags => void;
export type OnStatusStateChangeCallback = ({ [string]: boolean }) => void;
export type AdapterState = {
  user: User,
  onFlagsStateChange: OnFlagsStateChangeCallback,
  onStatusStateChange: OnStatusStateChangeCallback,
};
