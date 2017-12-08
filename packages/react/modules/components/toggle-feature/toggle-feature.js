import React from 'react';
import PropTypes from 'prop-types';

const isEmptyChildren = children => React.Children.count(children) === 0;

export default class ToggleFeature extends React.PureComponent {
  static displayName = 'ToggleFeature';
  static propTypes = {
    untoggledComponent: PropTypes.func,
    toggledComponent: PropTypes.func,
    render: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
    // HoC
    isFeatureEnabled: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    untoggledComponent: null,
    toggledComponent: null,
    render: null,
    children: null,
  };

  render() {
    if (this.props.isFeatureEnabled) {
      if (this.props.toggledComponent)
        return React.createElement(this.props.toggledComponent);

      if (this.props.children && !isEmptyChildren(this.props.children))
        return React.Children.only(this.props.children);

      if (typeof this.props.render === 'function') return this.props.render();
    }

    if (typeof this.props.children === 'function')
      return this.props.children({
        isFeatureEnabled: this.props.isFeatureEnabled,
      });

    if (this.props.untoggledComponent) {
      return React.createElement(this.props.untoggledComponent);
    }

    return null;
  }
}
