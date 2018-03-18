// Type definitions for @flopflip/react-broadcast 5.x
// TypeScript Version: 2.x

declare module '@flopflip/react-broadcast' {
  import {
    FlagName,
    FlagVariation,
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
}
