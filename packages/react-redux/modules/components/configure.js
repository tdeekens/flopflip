import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FlagsSubscription } from '@flopflip/react';
import { updateStatus, updateFlags } from './../ducks';

export class Configure extends React.Component {
  static displayName = 'ConfigureFlopflip';
  static propTypes = {
    children: PropTypes.node,
    clientSideId: PropTypes.string.isRequired,
    user: PropTypes.shape({
      key: PropTypes.string,
    }),
    shouldInitialize: PropTypes.func,

    // Connected
    handleUpdateStatus: PropTypes.func.isRequired,
    handleUpdateFlags: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: null,
    user: {},
    shouldInitialize: () => true,
  };

  render() {
    return (
      <FlagsSubscription
        clientSideId={this.props.clientSideId}
        user={this.props.user}
        shouldInitialize={this.props.shouldInitialize}
        onUpdateStatus={this.props.handleUpdateStatus}
        onUpdateFlags={this.props.handleUpdateFlags}
      >
        {this.props.children ? React.Children.only(this.props.children) : null}
      </FlagsSubscription>
    );
  }
}

const mapDispatchToProps = {
  handleUpdateStatus: updateStatus,
  handleUpdateFlags: updateFlags,
};

export default connect(null, mapDispatchToProps)(Configure);
