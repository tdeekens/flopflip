// @flow

import type {
  FlagName,
  FlagVariation,
  Flags,
  Adapter,
  AdapterArgs,
  User,
} from '@flopflip/types';

import React, { PureComponent, type Node } from 'react';
import createReactContext, { type Context } from 'create-react-context';

export const AdapterStates: {
  UNCONFIGURED: string,
  CONFIGURING: string,
  CONFIGURED: string,
} = {
  UNCONFIGURED: 'unconfigured',
  CONFIGURING: 'configuring',
  CONFIGURED: 'configured',
};

type Props = {
  shouldDeferAdapterConfiguration?: boolean,
  adapter: Adapter,
  adapterArgs: AdapterArgs,
  defaultFlags?: Flags,
  children: React.Component<any>,
};
type State = {
  adapterArgs: AdapterArgs,
};
type AdapterState = $Values<typeof AdapterStates>;
type AdapterContextType = (
  adapterArgs: AdapterArgs,
  { exact?: boolean }
) => void;

export const AdapterContext: Context<AdapterContextType> = createReactContext(
  () => {}
);

export default class ConfigureAdapter extends PureComponent<Props, State> {
  static defaultProps = {
    shouldDeferAdapterConfiguration: false,
    children: null,
    defaultFlags: {},
  };

  adapterState: AdapterState = AdapterStates.UNCONFIGURED;
  state: { adapterArgs: AdapterArgs } = {
    adapterArgs: this.props.adapterArgs,
  };
  setAdapterState = (
    nextAdapterState: AdapterState,
    exact: boolean = false
  ): void => {
    this.adapterState = nextAdapterState;
  };
  setAdapterArgs = (nextAdapterArgs: AdapterArgs): void =>
    this.setState(prevState => ({
      ...prevState,
      adapterArgs: nextAdapterArgs,
    }));

  reconfigure = (
    { user: nextUser }: { user: User },
    { exact = false }: { exact?: boolean } = {}
  ): void =>
    this.setAdapterArgs({
      ...this.props.adapterArgs,
      ...{
        user: exact
          ? nextUser
          : { ...this.props.adapterArgs.user, ...nextUser },
      },
    });

  handleDefaultFlags = (defaultFlags: Flags): void => {
    if (Object.keys(defaultFlags).length > 0) {
      this.props.adapterArgs.onFlagsStateChange(defaultFlags);
    }
  };

  componentDidMount(): Promise<any> | void {
    this.handleDefaultFlags(this.props.defaultFlags);

    if (!this.props.shouldDeferAdapterConfiguration) {
      this.setAdapterState(AdapterStates.CONFIGURING);

      return this.props.adapter.configure(this.state.adapterArgs).then(() => {
        this.setAdapterState(AdapterStates.CONFIGURED);
      });
    }
  }

  componentDidUpdate(): Promise<any> | void {
    /**
     * NOTE:
     *    Be careful here to not double configure from `componentDidMount`.
     */

    if (
      !this.props.shouldDeferAdapterConfiguration &&
      this.adapterState !== AdapterStates.CONFIGURED &&
      this.adapterState !== AdapterStates.CONFIGURING
    ) {
      this.setAdapterState(AdapterStates.CONFIGURING);

      return this.props.adapter.configure(this.state.adapterArgs).then(() => {
        this.setAdapterState(AdapterStates.CONFIGURED);
      });
    } else if (
      this.adapterState === AdapterStates.CONFIGURED &&
      this.adapterState !== AdapterStates.CONFIGURING
    ) {
      this.setAdapterState(AdapterStates.CONFIGURING);

      return this.props.adapter.reconfigure(this.state.adapterArgs).then(() => {
        this.setAdapterState(AdapterStates.CONFIGURED);
      });
    }
  }

  render(): Node {
    return (
      <AdapterContext.Provider value={this.reconfigure}>
        {this.props.children ? React.Children.only(this.props.children) : null}
      </AdapterContext.Provider>
    );
  }
}
