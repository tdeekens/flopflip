import React from 'react';
import { connect } from 'react-redux';
import memoize from 'lodash/memoize';
import { ConfigureAdapter } from '@flopflip/react';
import {
  Flags,
  Adapter,
  AdapterArgs,
  AdapterEventHandlers,
  AdapterStatus,
  ConfigureAdapterChildren,
} from '@flopflip/types';
import { UpdateFlagsAction, UpdateStatusAction } from '../../types';
import { updateStatus, updateFlags } from './../../ducks';

type Props = {
  children?: ConfigureAdapterChildren;
  shouldDeferAdapterConfiguration?: boolean;
  defaultFlags?: Flags;
  adapterArgs: AdapterArgs;
  adapter: Adapter;
};
type ConnectedProps = {
  handleUpdateStatus: (status: AdapterStatus) => UpdateStatusAction;
  handleUpdateFlags: (flags: Flags) => UpdateFlagsAction;
};
type State = {
  flags: Flags;
};

const createAdapterArgs = memoize(
  (adapterArgs: AdapterArgs, eventHandlers: AdapterEventHandlers) => ({
    ...adapterArgs,
    ...eventHandlers,
  })
);

export class Configure extends React.PureComponent<
  Props & ConnectedProps,
  State
> {
  static displayName = 'ConfigureFlopflip';

  static defaultProps = {
    defaultFlags: {},
    shouldDeferAdapterConfiguration: false,
  };

  render(): React.ReactNode {
    return (
      <ConfigureAdapter
        adapter={this.props.adapter}
        adapterArgs={createAdapterArgs(this.props.adapterArgs, {
          onFlagsStateChange: this.props.handleUpdateFlags,
          onStatusStateChange: this.props.handleUpdateStatus,
        })}
        defaultFlags={this.props.defaultFlags}
        shouldDeferAdapterConfiguration={
          this.props.shouldDeferAdapterConfiguration
        }
      >
        {this.props.children}
      </ConfigureAdapter>
    );
  }
}

const mapDispatchToProps: ConnectedProps = {
  handleUpdateStatus: updateStatus,
  handleUpdateFlags: updateFlags,
};

export default connect(
  null,
  mapDispatchToProps
)(Configure);
