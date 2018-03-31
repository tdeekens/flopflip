// Type definitions for @flopflip/react 5.x
// TypeScript Version: 2.x

declare module '@flopflip/types' {
  import * as React from 'react';

  export type Diff<T extends string, U extends string> = ({ [P in T]: P } &
    { [P in U]: never } & { [x: string]: never })[T];
  export type Omit<T, K extends keyof T> = Pick<T, Diff<keyof T, K>>;

  export interface ComponentEnhancerWithProps<ProvidedProps, RerquiredProps> {
    <P extends ProvidedProps>(
      component: React.ComponentType<P>
    ): React.ComponentType<Omit<P, keyof ProvidedProps> & RerquiredProps>;
  }

  export type FlagName = string;
  export type FlagVariation = boolean | string;
  export interface Flag {
    flag: FlagName;
    variation?: FlagVariation;
  }
  export type User = {
    key?: string;
  };
  export type Flags = { [flagName: string]: FlagVariation };
  export type AdapterArgs = {
    user: User;
    onFlagsStateChange: () => void;
    onStatusStateChange: () => void;
  };
  export type Adapter = {
    configure: (adapterArgs: AdapterArgs) => Promise<any>;
    reconfigure: (adapterArgs: AdapterArgs) => Promise<any>;
  };

  export interface ToggleComponentCommonProps {
    toggledComponent?: React.ComponentType<any>;
    untoggledComponent?: React.ComponentType<any>;
    render?: () => React.ReactNode;
    children?:
      | (({ isFeatureEnabled: boolean }) => React.ReactNode)
      | React.ReactNode;
    isFeatureEnabled: boolean;
  }
  export interface ToggleComponentProps extends ToggleComponentCommonProps {
    isFeatureEnabled: boolean;
  }
  export interface ConfigureComponentProps {
    shouldDeferAdapterConfiguration?: boolean;
    defaultFlags?: Flags;
    adapterArgs: AdapterArgs;
    adapter: Adapter;
    children: React.ReactNode;
  }
  export interface ReconfigureComponentProps {
    exact?: boolean;
    user: User;
  }
  export interface SwitchComponenthProps {
    children?: React.ReactNode;
  }

  export function branchOnFeatureToggle<P extends {}>(
    flag: Flag,
    UntoggledComponent?: React.ComponentType<P>
  ): ComponentEnhancerWithProps<P, P>;

  export function injectFeatureToggle(
    flagName: FlagName,
    propKey?: string
  ): ComponentEnhancerWithProps<Flag, {}>;

  export function injectFeatureToggles(
    flagNames: Array<Flag>,
    propKey?: string
  ): ComponentEnhancerWithProps<{ [propKey: string]: Flags }, {}>;

  export class SwitchFeature extends React.Component<
    SwitchComponenthProps,
    any
  > {}

  export class ToggleFeature extends React.Component<
    ToggleComponentProps,
    any
  > {}

  export class ConfigureFlopflip extends React.Component<
    ConfigureComponentProps,
    any
  > {}

  export class ReconfigureFlopflip extends React.Component<
    ReconfigureComponentProps,
    any
  > {}
}
