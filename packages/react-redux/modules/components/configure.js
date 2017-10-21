import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { FlagsSubscription } from '@flopflip/react';
import { updateStatus, updateFlags } from './../ducks';

export class Configure extends React.PureComponent {
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

    // Connected
    handleUpdateStatus: PropTypes.func.isRequired,
    handleUpdateFlags: PropTypes.func.isRequired,
  };

  static defaultProps = {
    children: null,
    defaultFlags: {},
    shouldDeferAdapterConfiguration: false,
  };

  render() {
    return (
      <FlagsSubscription
        adapter={this.props.adapter}
        adapterArgs={{
          ...this.props.adapterArgs,
          onStatusStateChange: this.props.handleUpdateStatus,
          onFlagsStateChange: this.props.handleUpdateFlags,
        }}
        defaultFlags={this.props.defaultFlags}
        shouldDeferAdapterConfiguration={
          this.props.shouldDeferAdapterConfiguration
        }
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

/* istanbul ignore next */
export default connect(null, mapDispatchToProps)(Configure);
