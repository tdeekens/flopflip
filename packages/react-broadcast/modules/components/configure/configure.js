// @flow

import type {
  Flags,
  Adapter,
  AdapterArgs,
  AdapterState,
  AdapterStatus,
} from '@flopflip/types';

import React, { PureComponent, type ComponentType, type Node } from 'react';
import createReactContext, { type Context } from 'create-react-context';
import { ConfigureAdapter } from '@flopflip/react';

type Props = {
  children?: Node,
  shouldDeferAdapterConfiguration?: boolean,
  defaultFlags?: Flags,
  adapterArgs: AdapterArgs,
  adapter: Adapter,
};
type State = {
  flags: Flags,
};

export const FlagsContext: Context<Flags> = createReactContext({});

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

  isUnmounted: boolean;

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

  render(): Node {
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
