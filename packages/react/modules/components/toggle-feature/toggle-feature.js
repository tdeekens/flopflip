// @flow

import type {
  FlagName,
  FlagVariation,
  Flags,
  Adapter,
  AdapterArgs,
} from '@flopflip/types';

import React, { PureComponent, type ComponentType, type Node } from 'react';
import PropTypes from 'prop-types';
import { isValidElementType } from 'react-is';

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

  static propTypes = {
    untoggledComponent: (props: Props, propName: string) => {
      if (props[propName] && !isValidElementType(props[propName])) {
        return new Error(
          `Invalid prop 'untoggledComponent' supplied to 'Route': the prop is not a valid React component`
        );
      }
    },
    toggledComponent: (props: Props, propName: string) => {
      if (props[propName] && !isValidElementType(props[propName])) {
        return new Error(
          `Invalid prop 'toggledComponent' supplied to 'Route': the prop is not a valid React component`
        );
      }
    },
    render: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
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
