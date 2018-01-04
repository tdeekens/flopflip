// @flow

import type {
  FlagName,
  FlagVariation,
  Flags,
  Adapter,
  AdapterArgs,
} from '@flopflip/types';

import React, { PureComponent, type Node } from 'react';

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
type AdapterState = $Values<typeof AdapterStates>;

export default class FlagsSubscription extends PureComponent<Props> {
  static defaultProps = {
    shouldDeferAdapterConfiguration: false,
    children: null,
    defaultFlags: {},
  };

  adapterState: AdapterState = AdapterStates.UNCONFIGURED;
  setAdapterState = (nextAdapterState: AdapterState): void => {
    this.adapterState = nextAdapterState;
  };

  handleDefaultFlags = (defaultFlags: Flags): void => {
    if (Object.keys(defaultFlags).length > 0) {
      this.props.adapterArgs.onFlagsStateChange(defaultFlags);
    }
  };

  componentDidMount(): Promise<any> | void {
    this.handleDefaultFlags(this.props.defaultFlags);

    if (!this.props.shouldDeferAdapterConfiguration) {
      this.setAdapterState(AdapterStates.CONFIGURING);
      return this.props.adapter.configure(this.props.adapterArgs).then(() => {
        this.setAdapterState(AdapterStates.CONFIGURED);
      });
    }
  }

  componentDidUpdate(): Promise<any> | void {
    // NOTE: We have to be careful here to not double configure from `componentDidMount`.
    if (
      !this.props.shouldDeferAdapterConfiguration &&
      this.adapterState !== AdapterStates.CONFIGURED &&
      this.adapterState !== AdapterStates.CONFIGURING
    ) {
      this.setAdapterState(AdapterStates.CONFIGURING);

      return this.props.adapter.configure(this.props.adapterArgs).then(() => {
        this.setAdapterState(AdapterStates.CONFIGURED);
      });
    } else if (
      this.adapterState === AdapterStates.CONFIGURED &&
      this.adapterState !== AdapterStates.CONFIGURING
    ) {
      this.setAdapterState(AdapterStates.CONFIGURING);

      return this.props.adapter.reconfigure(this.props.adapterArgs).then(() => {
        this.setAdapterState(AdapterStates.CONFIGURED);
      });
    }
  }

  render(): Node {
    return React.Children.only(this.props.children);
  }
}
