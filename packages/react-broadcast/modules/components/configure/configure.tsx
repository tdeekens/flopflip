import React from 'react';
import { ConfigureAdapter } from '@flopflip/react';
import memoize from 'lodash/memoize';
import {
  Flags,
  Adapter,
  AdapterArgs,
  AdapterEventHandlers,
  AdapterStatus,
  ConfigureAdapterChildren,
} from '@flopflip/types';
import { FlagsContext } from '../flags-context';

type Props = {
  children?: ConfigureAdapterChildren;
  shouldDeferAdapterConfiguration?: boolean;
  defaultFlags?: Flags;
  adapterArgs: AdapterArgs;
  adapter: Adapter;
};
type State = {
  flags: Flags;
  status: AdapterStatus;
};

const createAdapterArgs = memoize(
  (adapterArgs: AdapterArgs, eventHandlers: AdapterEventHandlers) => ({
    ...adapterArgs,
    ...eventHandlers,
  })
);

export default class Configure extends React.PureComponent<Props, State> {
  static displayName = 'ConfigureFlopflip';

  static defaultProps = {
    defaultFlags: {},
    shouldDeferAdapterConfiguration: false,
  };

  state: { flags: Flags; status: AdapterStatus } = {
    flags: {},
    status: {
      isReady: false,
      isConfigured: false,
    },
  };

  isUnmounted: boolean = false;

  componentDidMount() {
    this.isUnmounted = false;
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  handleUpdateFlags = (nextFlags: Flags): void => {
    !this.isUnmounted &&
      this.setState(prevState => ({
        flags: {
          ...prevState.flags,
          ...nextFlags,
        },
      }));
  };

  handleUpdateStatus = (status: AdapterStatus): void => {
    !this.isUnmounted &&
      this.setState(prevState => ({
        status: {
          ...prevState.status,
          ...status,
        },
      }));
  };

  render(): React.ReactNode {
    return (
      <FlagsContext.Provider value={this.state.flags}>
        <ConfigureAdapter
          adapter={this.props.adapter}
          adapterArgs={createAdapterArgs(this.props.adapterArgs, {
            onFlagsStateChange: this.handleUpdateFlags,
            onStatusStateChange: this.handleUpdateStatus,
          })}
          adapterStatus={this.state.status}
          defaultFlags={this.props.defaultFlags}
          shouldDeferAdapterConfiguration={
            this.props.shouldDeferAdapterConfiguration
          }
        >
          {this.props.children}
        </ConfigureAdapter>
      </FlagsContext.Provider>
    );
  }
}
