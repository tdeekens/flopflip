import PropTypes from 'prop-types';
import React from 'react';
import { FlagsSubscription } from '@flopflip/react';
import { Broadcast } from 'react-broadcast';

export const FLAGS_CHANNEL = '@flopflip';

export default class Configure extends React.PureComponent {
  static displayName = 'ConfigureFlopflip';

  static propTypes = {
    children: PropTypes.node,
    shouldConfigure: PropTypes.bool,
    shouldReconfigure: PropTypes.bool,
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
    shouldConfigure: true,
    shouldReconfigure: false,
  };

  state = {
    flags: {},
    status: { isReady: false },
  };

  handleUpdateFlags = flags => {
    this.setState(prevState => ({
      flags: {
        ...prevState.flags,
        ...flags,
      },
    }));
  };

  handleUpdateStatus = status => {
    this.setState({ status });
  };

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
        shouldConfigure={this.props.shouldConfigure}
        shouldReconfigure={this.props.shouldReconfigure}
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
