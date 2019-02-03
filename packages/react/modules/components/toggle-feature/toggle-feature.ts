import {
  FlagName,
  FlagVariation,
  Flags,
  Adapter,
  AdapterArgs,
} from '@flopflip/types';

import React from 'react';
import PropTypes from 'prop-types';
import { isValidElementType } from 'react-is';

type Props = {
  untoggledComponent?: React.ComponentType<any>;
  toggledComponent?: React.ComponentType<any>;
  render?: () => Node;
  children?: ({ isFeatureEnabled: boolean }) => React.Node;
  isFeatureEnabled: boolean;
};

const isEmptyChildren = (children: React.Node): boolean =>
  React.Children.count(children) === 0;

export default class ToggleFeature extends React.PureComponent<Props> {
  static displayName = 'ToggleFeature';

  static defaultProps = {
    untoggledComponent: null,
    toggledComponent: null,
    render: null,
    children: null,
  };

  static propTypes = {
    untoggledComponent: (props: Props, propName: string): Error | void => {
      if (props[propName] && !isValidElementType(props[propName])) {
        return new Error(
          `Invalid prop 'untoggledComponent' supplied to 'ToggleFeature': the prop is not a valid React component`
        );
      }
    },
    toggledComponent: (props: Props, propName: string): Error | void => {
      if (props[propName] && !isValidElementType(props[propName])) {
        return new Error(
          `Invalid prop 'toggledComponent' supplied to 'ToggleFeature': the prop is not a valid React component`
        );
      }
    },
    render: PropTypes.func,
    children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  };

  render(): React.Node {
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
