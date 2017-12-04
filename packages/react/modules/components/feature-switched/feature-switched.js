import React from 'react';
import PropTypes from 'prop-types';

const isEmptyChildren = children => React.Children.count(children) === 0;

export default class FeatureToggled extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
  };

  render() {
    let variate, child;
    React.Children.forEach(this.props.children, element => {
      if (variate == null && React.isValidElement(element)) {
        child = element;
        variate = element.props.isFeatureEnabled ? element.props.variate : null;
      }
    });

    return variate ? React.cloneElement(child, { variate }) : null;
  }
}
