// @flow

import type {
  Flags,
  AdapterArgs,
  AdapterState,
  AdapterStatus,
} from '@flopflip/types';

import React, { PureComponent, type ComponentType, type Node } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ConfigureAdapter } from '@flopflip/react';
import { updateStatus, updateFlags } from './../../ducks';

type Props = {
  children?: Node,
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

/**
 * NOTE:
 *    This function can not be memoized otherwise it will
 *    rewrire different `ConfigureFlopflip`s to the same change
 *    handlers as these functions seem to be referentially equal even
 *    across different instances of React components due to hoisting.
 */
const createAdapterArgs = (
  adapterArgs,
  handleUpdateStatus,
  handleUpdateFlags
) => ({
  ...adapterArgs,
  onStatusStateChange: handleUpdateStatus,
  onFlagsStateChange: handleUpdateFlags,
});

export class Configure extends PureComponent<Props & ConnectedProps, State> {
  static displayName = 'ConfigureFlopflip';

  static defaultProps = {
    children: null,
    defaultFlags: {},
    shouldDeferAdapterConfiguration: false,
  };

  static propTypes = {
    children: PropTypes.element,
    defaultFlags: PropTypes.object,
    shouldDeferAdapterConfiguration: PropTypes.bool,
  };

  render(): Node {
    return (
      <ConfigureAdapter
        adapter={this.props.adapter}
        adapterArgs={createAdapterArgs(
          this.props.adapterArgs,
          this.props.handleUpdateStatus,
          this.props.handleUpdateFlags
        )}
        defaultFlags={this.props.defaultFlags}
        shouldDeferAdapterConfiguration={
          this.props.shouldDeferAdapterConfiguration
        }
      >
        {this.props.children ? React.Children.only(this.props.children) : null}
      </ConfigureAdapter>
    );
  }
}

const mapDispatchToProps: ConnectedProps = {
  handleUpdateStatus: updateStatus,
  handleUpdateFlags: updateFlags,
};

/* istanbul ignore next */
export default connect(
  null,
  mapDispatchToProps
)(Configure);
