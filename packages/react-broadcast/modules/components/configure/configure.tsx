import React from 'react';
import { ConfigureAdapter } from '@flopflip/react';
import {
  Flags,
  Adapter,
  AdapterStatus,
  ConfigureAdapterChildren,
  ConfigureAdapterProps,
} from '@flopflip/types';
import { FlagsContext } from '../flags-context';

type BaseProps = {
  children?: ConfigureAdapterChildren;
  shouldDeferAdapterConfiguration?: boolean;
  defaultFlags?: Flags;
};
type Props<AdapterInstance extends Adapter> = BaseProps &
  ConfigureAdapterProps<AdapterInstance>;
type State = {
  flags: Flags;
  status: AdapterStatus;
  configurationId?: string;
};

export default class Configure<
  AdapterInstance extends Adapter
> extends React.PureComponent<Props<AdapterInstance>, State> {
  static displayName = 'ConfigureFlopflip';

  static defaultProps = {
    defaultFlags: {},
    shouldDeferAdapterConfiguration: false,
  };

  state: State = {
    flags: {},
    status: {
      isReady: false,
      isConfigured: false,
    },
  };

  isUnmounted = false;

  componentDidMount(): void {
    this.isUnmounted = false;
  }

  componentWillUnmount(): void {
    this.isUnmounted = true;
  }

  handleUpdateFlags = (nextFlags: Flags) => {
    if (!this.isUnmounted) {
      this.setState(prevState => ({
        flags: {
          ...prevState.flags,
          ...nextFlags,
        },
      }));
    }
  };

  handleUpdateStatus = (status: AdapterStatus) => {
    if (!this.isUnmounted) {
      this.setState(prevState => ({
        status: {
          ...prevState.status,
          ...status,
        },
      }));
    }
  };

  render(): React.ReactNode {
    return (
      <FlagsContext.Provider value={this.state.flags}>
        <ConfigureAdapter
          adapter={this.props.adapter}
          adapterArgs={this.props.adapterArgs}
          adapterStatus={this.state.status}
          defaultFlags={this.props.defaultFlags}
          shouldDeferAdapterConfiguration={
            this.props.shouldDeferAdapterConfiguration
          }
          onFlagsStateChange={this.handleUpdateFlags}
          onStatusStateChange={this.handleUpdateStatus}
        >
          {this.props.children}
        </ConfigureAdapter>
      </FlagsContext.Provider>
    );
  }
}
