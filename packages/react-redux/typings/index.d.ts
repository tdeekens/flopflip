// Type definitions for @flopflip/react-redux 5.x
// TypeScript Version: 2.x

declare module '@flopflip/react-redux' {
  import { FlagName, Flags } from '@flopflip/react/typings';

  export * from '@flopflip/react/typings';

  export function selectFlags(state: {}): Flags;
  export function selectFlag(flagName: FlagName): (state: {}) => Flags;
}
