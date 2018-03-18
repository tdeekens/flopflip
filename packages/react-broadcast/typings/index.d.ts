// Type definitions for @flopflip/react-broadcast 5.x
// TypeScript Version: 2.x

declare module '@flopflip/react-broadcast' {
  import Flag from '@flopflip/types';
  export * from '@flopflip/types';

  export interface ToggleComponentProps extends Flag {
    isFeatureEnabled?: boolean;
  }
}
