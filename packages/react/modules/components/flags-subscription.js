import PropTypes from 'prop-types';
import React from 'react';
import {
  initialize,
  listen,
  changeUserContext,
  camelCaseFlags,
} from '@flopflip/launchdarkly-wrapper';

export default class FlagsSubscription extends React.Component {
  static propTypes = {
    shouldInitialize: PropTypes.bool.isRequired,
    shouldChangeUserContext: PropTypes.bool.isRequired,
    clientSideId: PropTypes.string.isRequired,
    user: PropTypes.shape({
      key: PropTypes.string,
    }),
    defaultFlags: PropTypes.object,
    onUpdateFlags: PropTypes.func.isRequired,
    onUpdateStatus: PropTypes.func.isRequired,
    children: PropTypes.node,
  };

  state = { isInitialized: false };

  static defaultProps = {
    user: {},
    defaultFlags: {},
  };

  initializeFlagListening = () => {
    if (!this.state.isInitialized) {
      this.client = initialize({
        clientSideId: this.props.clientSideId,
        user: this.props.user,
      });

      listen({
        client: this.client,
        onUpdateFlags: this.props.onUpdateFlags,
        onUpdateStatus: this.props.onUpdateStatus,
      });

      this.setState({ isInitialized: true });
    }
  };

  changeUserContext = () => {
    changeUserContext({ client: this.client, user: this.props.user });
  };

  handleDefaultFlags = defaultFlags => {
    if (Object.keys(defaultFlags).length > 0) {
      this.props.onUpdateFlags(camelCaseFlags(defaultFlags));
    }
  };

  componentDidMount() {
    this.handleDefaultFlags(this.props.defaultFlags);
    if (this.props.shouldInitialize) this.initializeFlagListening();
  }

  componentDidUpdate(prevProps) {
    if (this.props.shouldInitialize) this.initializeFlagListening();

    if (
      this.props.shouldChangeUserContext &&
      this.props.user &&
      prevProps.user.key !== this.props.user.key
    ) {
      this.changeUserContext();
    }
  }

  render() {
    return React.Children.only(this.props.children);
  }
}
