import PropTypes from 'prop-types';
import React from 'react';
import { FlagsSubscription } from '@flopflip/react';
import { Broadcast } from 'react-broadcast';

export const FLAGS_CHANNEL = '@flopflip';

export default class Configure extends React.PureComponent {
  static displayName = 'ConfigureFlopflip';

  static propTypes = {
    children: PropTypes.node,
    clientSideId: PropTypes.string,
    shouldInitialize: PropTypes.bool,
    shouldChangeUserContext: PropTypes.bool,
    defaultFlags: PropTypes.object,
    user: PropTypes.shape({
      key: PropTypes.string,
    }),
  };

  static defaultProps = {
    children: null,
    clientSideId: null,
    user: {},
    defaultFlags: {},
    shouldInitialize: true,
    shouldChangeUserContext: false,
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
        defaultFlags={this.props.defaultFlags}
        shouldInitialize={this.props.shouldInitialize}
        shouldChangeUserContext={this.props.shouldChangeUserContext}
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
