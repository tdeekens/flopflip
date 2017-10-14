import React from 'react';
import PropTypes from 'prop-types';

export default class FeatureToggled extends React.PureComponent {
  static propTypes = {
    untoggledComponent: PropTypes.element,
    children: PropTypes.element.isRequired,

    // HoC
    isFeatureEnabled: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    untoggledComponent: null,
  };

  render() {
    if (this.props.isFeatureEnabled) {
      return this.props.children;
    }

    return this.props.untoggledComponent;
  }
}
