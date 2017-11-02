import PropTypes from 'prop-types';
import React from 'react';
import { FlagsSubscription } from '@flopflip/react';
import { Broadcast } from 'react-broadcast';

export const FLAGS_CHANNEL = '@flopflip';

export default class Configure extends React.PureComponent {
  static displayName = 'ConfigureFlopflip';

  static propTypes = {
    children: PropTypes.node,
    shouldDeferAdapterConfiguration: PropTypes.bool,
    defaultFlags: PropTypes.object,
    adapterArgs: PropTypes.shape({
      user: PropTypes.shape({
        key: PropTypes.string,
      }),
    }).isRequired,
    adapter: PropTypes.object.isRequired,
  };

  static defaultProps = {
    children: null,
    defaultFlags: {},
    shouldDeferAdapterConfiguration: false,
  };

  state = {
    flags: {},
  };

  handleUpdateFlags = flags => {
    this.setState(prevState => ({
      flags: {
        ...prevState.flags,
        ...flags,
      },
    }));
  };

  handleUpdateStatus = status =>
    this.setState(prevState => ({ ...prevState, ...status }));

  render() {
    return (
      <FlagsSubscription
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
      </FlagsSubscription>
    );
  }
}
