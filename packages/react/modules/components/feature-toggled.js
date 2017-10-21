import React from 'react';
import PropTypes from 'prop-types';

const isEmptyChildren = children => React.Children.count(children) === 0;

export default class FeatureToggled extends React.PureComponent {
  static propTypes = {
    untoggledComponent: PropTypes.node,
    toggledComponent: PropTypes.node,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),

    // HoC
    isFeatureEnabled: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    untoggledComponent: null,
    toggledComponent: null,
    children: null,
  };

  render() {
    if (this.props.isFeatureEnabled) {
      if (!isEmptyChildren(this.props.toggledComponent))
        return React.cloneElement(this.props.toggledComponent);

      if (typeof this.props.children === 'function')
        return this.props.children();

      if (this.props.children && !isEmptyChildren(this.props.children))
        return React.Children.only(this.props.children);
    } else if (!isEmptyChildren(this.props.untoggledComponent)) {
      return React.cloneElement(this.props.untoggledComponent);
    }

    return null;
  }
}
