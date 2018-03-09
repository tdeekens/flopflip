// Type definitions for @flopflip/react-redux 5.x
// TypeScript Version: 2.x

declare module '@flopflip/react-redux' {
  import { Flag, FlagName, Flags } from '@flopflip/types';

  export * from '@flopflip/types';
  export function selectFlags(state: {}): Flags;
  export function selectFlag(flagName: FlagName): (state: {}) => Flags;

  export interface ToggleComponentProps extends Flag {
    isFeatureEnabled?: boolean;
  }
}
