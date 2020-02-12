import React from 'react';
import { ConfigureAdapter } from '@flopflip/react';
import {
  TFlags,
  TAdapter,
  TAdapterStatus,
  TConfigureAdapterChildren,
  TConfigureAdapterProps,
} from '@flopflip/types';
import { FlagsContext } from '../flags-context';

type BaseProps = {
  children?: TConfigureAdapterChildren;
  shouldDeferAdapterConfiguration?: boolean;
  defaultFlags?: TFlags;
};
type Props<AdapterInstance extends TAdapter> = BaseProps &
  TConfigureAdapterProps<AdapterInstance>;
type State = {
  flags: TFlags;
  status: TAdapterStatus;
  configurationId?: string;
};

export default class Configure<
  AdapterInstance extends TAdapter
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

  handleUpdateFlags = (nextFlags: TFlags) => {
    if (!this.isUnmounted) {
      this.setState(prevState => ({
        flags: {
          ...prevState.flags,
          ...nextFlags,
        },
      }));
    }
  };

  handleUpdateStatus = (status: TAdapterStatus) => {
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
