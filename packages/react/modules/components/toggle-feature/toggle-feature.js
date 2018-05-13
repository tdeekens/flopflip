// @flow

import type {
  FlagName,
  FlagVariation,
  Flags,
  Adapter,
  AdapterArgs,
} from '@flopflip/types';

import React, { PureComponent, type ComponentType, type Node } from 'react';

type Props = {
  untoggledComponent?: ComponentType<any>,
  toggledComponent?: ComponentType<any>,
  render?: () => Node,
  children?: ({ isFeatureEnabled: boolean }) => Node,
  isFeatureEnabled: boolean,
};

const isEmptyChildren = (children: Node): boolean =>
  React.Children.count(children) === 0;

export default class ToggleFeature extends PureComponent<Props> {
  static displayName = 'ToggleFeature';

  static defaultProps = {
    untoggledComponent: null,
    toggledComponent: null,
    render: null,
    children: null,
  };

  render(): Node {
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
