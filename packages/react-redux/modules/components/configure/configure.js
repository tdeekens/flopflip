// @flow

import type {
  Flags,
  AdapterArgs,
  AdapterState,
  AdapterStatus,
} from '../../types.js';

import * as React from 'react';
import { connect } from 'react-redux';
import { FlagsSubscription } from '@flopflip/react';
import { updateStatus, updateFlags } from './../../ducks';

type Props = {
  children?: React.Node,
  shouldDeferAdapterConfiguration?: boolean,
  defaultFlags?: Flags,
  adapterArgs: AdapterArgs,
  adapter: mixed,
};
type ConnectedProps = {
  handleUpdateStatus: () => void,
  handleUpdateFlags: () => void,
};
type State = {
  flags: Flags,
};

export class Configure extends React.PureComponent<
  Props & ConnectedProps,
  State
> {
  static displayName = 'ConfigureFlopflip';

  static defaultProps = {
    children: null,
    defaultFlags: {},
    shouldDeferAdapterConfiguration: false,
  };

  render(): React.Node {
    return (
      <FlagsSubscription
        adapter={this.props.adapter}
        adapterArgs={{
          ...this.props.adapterArgs,
          onStatusStateChange: this.props.handleUpdateStatus,
          onFlagsStateChange: this.props.handleUpdateFlags,
        }}
        defaultFlags={this.props.defaultFlags}
        shouldDeferAdapterConfiguration={
          this.props.shouldDeferAdapterConfiguration
        }
      >
        {this.props.children ? React.Children.only(this.props.children) : null}
      </FlagsSubscription>
    );
  }
}

const mapDispatchToProps: ConnectedProps = {
  handleUpdateStatus: updateStatus,
  handleUpdateFlags: updateFlags,
};

/* istanbul ignore next */
export default connect(null, mapDispatchToProps)(Configure);
