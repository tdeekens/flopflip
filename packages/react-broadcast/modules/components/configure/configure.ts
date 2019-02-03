import { Flags, Adapter, AdapterArgs, AdapterStatus } from '@flopflip/types';

import React from 'react';
import PropTypes from 'prop-types';
import { ConfigureAdapter } from '@flopflip/react';
import { FlagsContext } from '../flags-context';

type Props = {
  children?: Node;
  shouldDeferAdapterConfiguration?: boolean;
  defaultFlags?: Flags;
  adapterArgs: AdapterArgs;
  adapter: Adapter;
};
type State = {
  flags: Flags;
};

/**
 * NOTE:
 *    This function can not be memoized otherwise it will
 *    rewrire different `ConfigureFlopflip`s to the same change
 *    handlers as these functions seem to be referentially equal even
 *    across different instances of React components due to hoisting.
 */
const createAdapterArgs = (
  adapterArgs: AdapterArgs,
  handleUpdateStatus: (status: AdapterStatus) => void,
  handleUpdateFlags: (flags: Flags) => void
): AdapterArgs => ({
  ...adapterArgs,
  onStatusStateChange: handleUpdateStatus,
  onFlagsStateChange: handleUpdateFlags,
});

export default class Configure extends React.PureComponent<Props, State> {
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

  state: { flags: Flags } = {
    flags: {},
  };

  isUnmounted: boolean = false;

  componentDidMount() {
    this.isUnmounted = false;
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleUpdateFlags = (flags: Flags): void => {
    !this.isUnmounted &&
      this.setState(prevState => ({
        flags: {
          ...prevState.flags,
          ...flags,
        },
      }));
  };

  handleUpdateStatus = (status: AdapterStatus): void => {
    !this.isUnmounted &&
      this.setState(prevState => ({ ...prevState, ...status }));
  };

  render(): React.Node {
    return (
      <ConfigureAdapter
        adapter={this.props.adapter}
        adapterArgs={createAdapterArgs(
          this.props.adapterArgs,
          this.handleUpdateStatus,
          this.handleUpdateFlags
        )}
        defaultFlags={this.props.defaultFlags}
        shouldDeferAdapterConfiguration={
          this.props.shouldDeferAdapterConfiguration
        }
      >
        <FlagsContext.Provider value={this.state.flags}>
          {this.props.children
            ? React.Children.only(this.props.children)
            : null}
        </FlagsContext.Provider>
      </ConfigureAdapter>
    );
  }
}
