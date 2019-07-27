import React from 'react';
import warning from 'tiny-warning';
import { isValidElementType } from 'react-is';

type Props = {
  untoggledComponent?: React.ComponentType;
  toggledComponent?: React.ComponentType;
  render?: () => Node;
  children?: ({
    isFeatureEnabled: boolean,
  }) => React.ReactNode | React.ReactNode;
  isFeatureEnabled: boolean;
};

const isEmptyChildren = (children: React.ReactNode): boolean =>
  React.Children.count(children) === 0;

export default class ToggleFeature extends React.PureComponent<Props> {
  static displayName = 'ToggleFeature';

  static defaultProps = {
    untoggledComponent: null,
    toggledComponent: null,
    render: null,
    children: null,
  };

  render(): React.ReactNode {
    if (this.props.untoggledComponent)
      warning(
        isValidElementType(this.props.untoggledComponent),
        `Invalid prop 'untoggledComponent' supplied to 'ToggleFeature': the prop is not a valid React component`
      );

    if (this.props.toggledComponent)
      warning(
        isValidElementType(this.props.toggledComponent),
        `Invalid prop 'toggledComponent' supplied to 'ToggleFeature': the prop is not a valid React component`
      );

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
