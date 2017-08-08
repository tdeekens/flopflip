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
    defaultFlags: PropTypes.object,
    shouldInitialize: PropTypes.bool,

    // Connected
    handleUpdateStatus: PropTypes.func.isRequired,
    handleUpdateFlags: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: null,
    user: {},
    defaultFlags: {},
    shouldInitialize: true,
  };

  render() {
    return (
      <FlagsSubscription
        clientSideId={this.props.clientSideId}
        user={this.props.user}
        defaultFlags={this.props.defaultFlags}
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
