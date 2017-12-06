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
    isAdapterConfiguring: false,
  };

  handleDefaultFlags = defaultFlags => {
    if (Object.keys(defaultFlags).length > 0) {
      this.props.adapterArgs.onFlagsStateChange(defaultFlags);
    }
  };

  componentDidMount() {
    this.handleDefaultFlags(this.props.defaultFlags);

    if (!this.props.shouldDeferAdapterConfiguration) {
      this.setState({ isAdapterConfiguring: true });
      return this.props.adapter.configure(this.props.adapterArgs).then(() => {
        this.setState({ isAdapterConfiguring: false });
        this.setState({ isAdapterConfigured: true });
      });
    }
  }

  componentDidUpdate() {
    // NOTE: We have to be careful here to not double configure from `componentDidMount`.
    if (
      !this.props.shouldDeferAdapterConfiguration &&
      !this.state.isAdapterConfiguring &&
      !this.state.isAdapterConfigured
    ) {
      this.setState({ isAdapterConfiguring: true }); // eslint-disable-line react/no-did-update-set-state

      return this.props.adapter.configure(this.props.adapterArgs).then(() => {
        this.setState({ isAdapterConfigured: true });
        this.setState({ isAdapterConfiguring: false });
      });
    } else if (
      this.state.isAdapterConfigured &&
      !this.state.isAdapterConfiguring
    ) {
      this.setState({ isAdapterConfiguring: true }); // eslint-disable-line react/no-did-update-set-state

      return this.props.adapter.reconfigure(this.props.adapterArgs).then(() => {
        this.setState({ isAdapterConfigured: true });
        this.setState({ isAdapterConfiguring: false });
      });
    }
  }

  render() {
    return React.Children.only(this.props.children);
  }
}
