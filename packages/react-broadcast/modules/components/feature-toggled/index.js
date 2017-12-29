// @flow

import * as React from 'react';
import warning from 'warning';
import ToggleFeature from '../toggle-feature';

type Props = {
  children?: React.Node,
};

export default class FeatureToggled extends React.PureComponent<Props> {
  render() {
    warning(
      false,
      '`<FeatureToggled />` has been deprecated, please us `<ToggleFeature />`'
    );

    return React.createElement(ToggleFeature, this.props, this.props.children);
  }
}
