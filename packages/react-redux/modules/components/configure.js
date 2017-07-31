import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { initialize, listen } from '@flopflip/launchdarkly-wrapper';
import { updateStatus, updateFlags } from './../ducks';

export class Configure extends React.Component {
  static displayName = 'ConfigureFlopflip';
  static propTypes = {
    children: PropTypes.node,
    clientSideId: PropTypes.string.isRequired,
    user: PropTypes.shape({
      key: PropTypes.string,
    }),

    // Connected
    updateStatus: PropTypes.func.isRequired,
    updateFlags: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: null,
    user: {},
  };

  componentDidMount() {
    listen({
      client: initialize({
        clientSideId: this.props.clientSideId,
        user: this.props.user,
      }),
      updateFlags: this.props.updateFlags,
      updateStatus: this.props.updateStatus,
    });
  }

  render() {
    return this.props.children
      ? React.Children.only(this.props.children)
      : null;
  }
}

const mapDispatchToProps = {
  updateStatus,
  updateFlags,
};

export default connect(null, mapDispatchToProps)(Configure);
