import PropTypes from 'prop-types';
import React from 'react';
import {
  initialize,
  listen,
  camelCaseFlags,
} from '@flopflip/launchdarkly-wrapper';

export default class FlagsSubscription extends React.Component {
  static propTypes = {
    shouldInitialize: PropTypes.func.isRequired,
    clientSideId: PropTypes.string.isRequired,
    user: PropTypes.shape({
      key: PropTypes.string,
    }),
    defaultFlags: PropTypes.object,
    onUpdateFlags: PropTypes.func.isRequired,
    onUpdateStatus: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
  };

  state = { isInitialized: false };

  static defaultProps = {
    user: {},
    defaultFlags: {},
  };

  initializeFlagListening = () => {
    if (!this.state.isInitialized) {
      listen({
        client: initialize({
          clientSideId: this.props.clientSideId,
          user: this.props.user,
        }),
        onUpdateFlags: this.props.onUpdateFlags,
        onUpdateStatus: this.props.onUpdateStatus,
      });

      this.setState({ isInitialized: true });
    }
  };

  handleDefaultFlags = defaultFlags => {
    if (Object.keys(defaultFlags).length > 0) {
      this.props.onUpdateFlags(camelCaseFlags(defaultFlags));
    }
  };

  componentDidMount() {
    this.handleDefaultFlags(this.props.defaultFlags);
    if (this.props.shouldInitialize()) this.initializeFlagListening();
  }

  componentWillReceiveProps() {
    if (this.props.shouldInitialize()) this.initializeFlagListening();
  }

  render() {
    return React.Children.only(this.props.children);
  }
}
