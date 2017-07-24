import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { STATE_SLICE } from './../store';

export class FeatureToggled extends React.Component {
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

export default connect((state, ownProps) => ({
  isFeatureEnabled: Boolean(state[STATE_SLICE].flags[ownProps.flag]),
}))(FeatureToggled);
