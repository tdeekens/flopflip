// Type definitions for @flopflip/react-redux 5.x
// TypeScript Version: 2.x

declare module '@flopflip/react-redux' {
  import { Flag, FlagName, Flags } from '@flopflip/types';

  export * from '@flopflip/types';

  /**
   * NOTE:
   *   We do not extend `ToggleCOmponentProps` from `types`
   *   as we do not want the `isFeatureEnabled` property
   *   showing up.
   *   Extending `Flag` however will add `flag` and `variation`.
   */
  export interface ToggleComponentProps extends Flag {
    toggledComponent?: React.ComponentType<any>;
    untoggledComponent?: React.ComponentType<any>;
    render?: () => React.ReactNode;
    children?:
      | (({ isFeatureEnabled: boolean }) => React.ReactNode)
      | React.ReactNode;
  }

  export class ToggleFeature extends React.Component<
    ToggleComponentProps,
    any
  > {}

  export function selectFlags(state: {}): Flags;
  export function selectFlag(flagName: FlagName): (state: {}) => Flags;
}
