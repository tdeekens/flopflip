import PropTypes from 'prop-types';
import React from 'react';
import { initialize, listen } from '@flopflip/launchdarkly-wrapper';
import Broadcast from './broadcast';

export const FLAGS_CHANNEL = '@flopflip';

export default class Configure extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    clientSideId: PropTypes.string.isRequired,
    user: PropTypes.shape({
      key: PropTypes.string,
    }),
  };

  static defaultProps = {
    user: {},
  };

  state = {
    flags: {},
    status: { isReady: false },
  };

  componentDidMount() {
    listen({
      client: initialize({
        clientSideId: this.props.clientSideId,
        user: this.props.user,
      }),
      updateFlags: this.handleUpdateFlags,
      updateStatus: this.handleUpdateStatus,
    });
  }

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
      <Broadcast channel={FLAGS_CHANNEL} value={this.state.flags}>
        {this.props.children ? React.Children.only(this.props.children) : null}
      </Broadcast>
    );
  }
}
