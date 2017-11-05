import PropTypes from 'prop-types';
import React from 'react';

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

  state = {
    isAdapterConfigured: false,
  };

  handleDefaultFlags = defaultFlags => {
    if (Object.keys(defaultFlags).length > 0) {
      this.props.adapterArgs.onFlagsStateChange(defaultFlags);
    }
  };

  componentDidMount() {
    this.handleDefaultFlags(this.props.defaultFlags);

    if (!this.props.shouldDeferAdapterConfiguration)
      return this.props.adapter.configure(this.props.adapterArgs);
  }

  componentDidUpdate() {
    if (
      !this.props.shouldDeferAdapterConfiguration &&
      !this.state.isAdapterConfigured
    ) {
      return this.props.adapter.configure(this.props.adapterArgs).then(() => {
        this.setState({ isAdapterConfigured: true });
      });
    }

    if (this.state.isAdapterConfigured)
      return this.props.adapter.reconfigure(this.props.adapterArgs);
  }

  render() {
    return React.Children.only(this.props.children);
  }
}
