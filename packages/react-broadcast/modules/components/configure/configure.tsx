import React from 'react';
import { ConfigureAdapter, createSequentialId } from '@flopflip/react';
import memoize from 'memoize-one';
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
  configurationId?: string,
};

const getConfigurationId = createSequentialId('Configure');

const createAdapterArgs = memoize(
  (
    adapterArgs: AdapterArgs,
    eventHandlers: AdapterEventHandlers,
    _configurationId?: string
  ) => ({
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

  state: State = {
    flags: {},
    status: {
      isReady: false,
      isConfigured: false,
    },
    configurationId: undefined
  };

  isUnmounted = false;

  static getDerivedStateFromProps = () => ({
    configurationId: getConfigurationId(),
  });

  componentDidMount(): void {
    this.isUnmounted = false;
  }

  componentWillUnmount(): void {
    this.isUnmounted = true;
  }

  handleUpdateFlags = (nextFlags: Flags): void => {
    if (!this.isUnmounted) {
      this.setState(prevState => ({
        flags: {
          ...prevState.flags,
          ...nextFlags,
        },
      }));
    }
  };

  handleUpdateStatus = (status: AdapterStatus): void => {
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
          adapterArgs={createAdapterArgs(
            this.props.adapterArgs,
            {
              onFlagsStateChange: this.handleUpdateFlags,
              onStatusStateChange: this.handleUpdateStatus,
            },
            this.state.configurationId
          )}
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
