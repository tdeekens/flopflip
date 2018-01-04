// @flow

import * as React from 'react';
import { PureComponent } from 'react';
import warning from 'warning';
import ToggleFeature from '../toggle-feature';

type Props = {
  children?: React.Node,
};

export default class FeatureToggled extends PureComponent<Props> {
  render(): React.Element<any> {
    warning(
      false,
      '`<FeatureToggled />` has been deprecated, please us `<ToggleFeature />`'
    );

    return React.createElement(ToggleFeature, this.props, this.props.children);
  }
}
