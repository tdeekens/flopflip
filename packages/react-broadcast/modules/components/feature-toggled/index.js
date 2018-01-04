// @flow

import React, { PureComponent, type ComponentType, type Node } from 'react';
import warning from 'warning';
import ToggleFeature from '../toggle-feature';

type Props = {
  children?: Node,
};

export default class FeatureToggled extends PureComponent<Props> {
  render(): Node {
    warning(
      false,
      '`<FeatureToggled />` has been deprecated, please us `<ToggleFeature />`'
    );

    return React.createElement(ToggleFeature, this.props, this.props.children);
  }
}
