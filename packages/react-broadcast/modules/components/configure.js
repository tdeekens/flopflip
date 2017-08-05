import PropTypes from 'prop-types';
import React from 'react';
import { FlagsSubscription } from '@flopflip/react';
import Broadcast from './broadcast';

export const FLAGS_CHANNEL = '@flopflip';

export default class Configure extends React.Component {
  static displayName = 'ConfigureFlopflip';

  static propTypes = {
    children: PropTypes.node,
    clientSideId: PropTypes.string.isRequired,
    shouldInitialize: PropTypes.func,
    user: PropTypes.shape({
      key: PropTypes.string,
    }),
  };

  static defaultProps = {
    children: null,
    user: {},
    shouldInitialize: () => true,
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
        clientSideId={this.props.clientSideId}
        user={this.props.user}
        shouldInitialize={this.props.shouldInitialize}
        onUpdateStatus={this.handleUpdateStatus}
        onUpdateFlags={this.handleUpdateFlags}
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
