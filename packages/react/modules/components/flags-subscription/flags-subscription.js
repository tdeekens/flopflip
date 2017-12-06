import PropTypes from 'prop-types';
import React from 'react';

export const AdapterStates = {
  UNCONFIGURED: 'unconfigured',
  CONFIGURING: 'configuring',
  CONFIGURED: 'configured',
};

export default class FlagsSubscription extends React.PureComponent {
  static propTypes = {
    shouldDeferAdapterConfiguration: PropTypes.bool,
    adapterArgs: PropTypes.shape({
      user: PropTypes.shape({
        key: PropTypes.string,
      }),
      onFlagsStateChange: PropTypes.func.isRequired,
      onStatusStateChange: PropTypes.func.isRequired,
    }).isRequired,
    adapter: PropTypes.object.isRequired,
    defaultFlags: PropTypes.object,
    children: PropTypes.node,
  };

  static defaultProps = {
    shouldDeferAdapterConfiguration: false,
    children: null,
    defaultFlags: {},
  };

  adapterState = AdapterStates.UNCONFIGURED;
  setAdapterState = nextAdapterState => {
    this.adapterState = nextAdapterState;
  };

  handleDefaultFlags = defaultFlags => {
    if (Object.keys(defaultFlags).length > 0) {
      this.props.adapterArgs.onFlagsStateChange(defaultFlags);
    }
  };

  componentDidMount() {
    this.handleDefaultFlags(this.props.defaultFlags);

    if (!this.props.shouldDeferAdapterConfiguration) {
      this.setAdapterState(AdapterStates.CONFIGURING);
      return this.props.adapter.configure(this.props.adapterArgs).then(() => {
        this.setAdapterState(AdapterStates.CONFIGURED);
      });
    }
  }

  componentDidUpdate() {
    // NOTE: We have to be careful here to not double configure from `componentDidMount`.
    if (
      !this.props.shouldDeferAdapterConfiguration &&
      this.adapterState !== AdapterStates.CONFIGURED &&
      this.adapterState !== AdapterStates.CONFIGURING
    ) {
      this.setAdapterState(AdapterStates.CONFIGURING);

      return this.props.adapter.configure(this.props.adapterArgs).then(() => {
        this.setAdapterState(AdapterStates.CONFIGURED);
      });
    } else if (
      this.adapterState === AdapterStates.CONFIGURED &&
      this.adapterState !== AdapterStates.CONFIGURING
    ) {
      this.setAdapterState(AdapterStates.CONFIGURING);

      return this.props.adapter.reconfigure(this.props.adapterArgs).then(() => {
        this.setAdapterState(AdapterStates.CONFIGURED);
      });
    }
  }

  render() {
    return React.Children.only(this.props.children);
  }
}
