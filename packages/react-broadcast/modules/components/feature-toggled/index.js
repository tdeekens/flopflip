import React from 'react';
import PropTypes from 'prop-types';
import warning from 'warning';
import ToggleFeature from '../toggle-feature';

export default class FeatureToggled extends React.PureComponent {
  render() {
    warning(
      false,
      '`<FeatureToggled />` has been deprecated, please us `<ToggleFeature />`'
    );

    return React.createElement(ToggleFeature, this.props);
  }
}
