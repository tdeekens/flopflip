import PropTypes from 'prop-types';
import React from 'react';

export default class FlagsSubscription extends React.PureComponent {
  static propTypes = {
    shouldConfigure: PropTypes.bool.isRequired,
    shouldReconfigure: PropTypes.bool.isRequired,
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
    children: null,
    defaultFlags: {},
  };

  handleDefaultFlags = defaultFlags => {
    if (Object.keys(defaultFlags).length > 0) {
      this.props.adapterArgs.onFlagsStateChange(defaultFlags);
    }
  };

  componentDidMount() {
    this.handleDefaultFlags(this.props.defaultFlags);
    if (this.props.shouldConfigure)
      this.props.adapter.configure(this.props.adapterArgs);
  }

  componentDidUpdate() {
    if (this.props.shouldConfigure && !this.props.adapter.isConfigured()) {
      this.props.adapter.configure(this.props.adapterArgs);
      return;
    }

    if (
      this.props.shouldReconfigure &&
      this.props.adapter.isConfigured() &&
      this.props.adapter.isReady()
    )
      this.props.adapter.reConfigure(this.props.adapterArgs);
  }

  render() {
    return React.Children.only(this.props.children);
  }
}
