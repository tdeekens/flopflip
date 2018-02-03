// @flow

import type {
  Flags,
  Adapter,
  AdapterArgs,
  AdapterState,
  AdapterStatus,
} from '@flopflip/types';

import React, { PureComponent, type ComponentType, type Node } from 'react';
import { ConfigureAdapter } from '@flopflip/react';
import { Broadcast } from 'react-broadcast';
import { FLAGS_CHANNEL } from '../../constants';

type Props = {
  children: Node,
  shouldDeferAdapterConfiguration?: boolean,
  defaultFlags?: Flags,
  adapterArgs: AdapterArgs,
  adapter: Adapter,
};
type State = {
  flags: Flags,
};

export default class Configure extends PureComponent<Props, State> {
  static displayName = 'ConfigureFlopflip';

  static defaultProps = {
    children: null,
    defaultFlags: {},
    shouldDeferAdapterConfiguration: false,
  };

  state: { flags: Flags } = {
    flags: {},
  };

  handleUpdateFlags = (flags: Flags): void => {
    this.setState(prevState => ({
      flags: {
        ...prevState.flags,
        ...flags,
      },
    }));
  };

  handleUpdateStatus = (status: AdapterStatus): void =>
    this.setState(prevState => ({ ...prevState, ...status }));

  render(): Node {
    return (
      <ConfigureAdapter
        adapter={this.props.adapter}
        adapterArgs={{
          ...this.props.adapterArgs,
          onStatusStateChange: this.handleUpdateStatus,
          onFlagsStateChange: this.handleUpdateFlags,
        }}
        defaultFlags={this.props.defaultFlags}
        shouldDeferAdapterConfiguration={
          this.props.shouldDeferAdapterConfiguration
        }
      >
        <Broadcast channel={FLAGS_CHANNEL} value={this.state.flags}>
          {this.props.children
            ? React.Children.only(this.props.children)
            : null}
        </Broadcast>
      </ConfigureAdapter>
    );
  }
}
