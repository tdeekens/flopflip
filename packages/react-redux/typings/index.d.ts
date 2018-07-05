// Type definitions for @flopflip/react-redux 5.x
// TypeScript Version: 2.x

declare module '@flopflip/react-redux' {
  import {
    FlagName,
    FlagVariation,
    Flags,
    ToggleComponentCommonProps,
  } from '@flopflip/types';

  export * from '@flopflip/types';

  export interface ToggleComponentProps extends ToggleComponentCommonProps {
    flag: FlagName;
    variation?: FlagVariation;
  }

  export class ToggleFeature extends React.Component<
    ToggleComponentProps,
    any
  > {}

  export function createFlopFlipEnhancer(adapter: any, adapterArgs?: any): (next) => () => void;
  export function flopflipReducer(state: {}, action: {}): any;
  export function selectFeatureFlag(flagName: FlagName): (state: {}) => Flags;
  export function selectFeatureFlags(state: {}): Flags;

  export const FLOPFLIP_STATE_SLICE: string;
  export const version: string;
}
