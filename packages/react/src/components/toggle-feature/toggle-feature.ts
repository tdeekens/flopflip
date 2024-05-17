import React from 'react';
import { isValidElementType } from 'react-is';
import warning from 'tiny-warning';

type RenderFnArgs = {
  isFeatureEnabled: boolean;
};
type TRenderFn = (args: RenderFnArgs) => React.ReactNode;
export type TProps = {
  readonly untoggledComponent?: React.ComponentType;
  readonly toggledComponent?: React.ComponentType;
  readonly render?: () => React.ReactNode;
  readonly children?: TRenderFn | React.ReactNode;
  readonly isFeatureEnabled: boolean;
};

function ToggleFeature(props: TProps) {
  if (props.untoggledComponent)
    warning(
      isValidElementType(props.untoggledComponent),
      `Invalid prop 'untoggledComponent' supplied to 'ToggleFeature': the prop is not a valid React component`
    );

  if (props.toggledComponent)
    warning(
      isValidElementType(props.toggledComponent),
      `Invalid prop 'toggledComponent' supplied to 'ToggleFeature': the prop is not a valid React component`
    );

  if (props.isFeatureEnabled) {
    if (props.toggledComponent)
      return React.createElement(props.toggledComponent);

    if (props.children) {
      if (typeof props.children === 'function')
        return props.children({
          isFeatureEnabled: props.isFeatureEnabled,
        });
      return React.Children.only<React.ReactNode>(props.children);
    }

    if (typeof props.render === 'function') return props.render();
  }

  if (typeof props.children === 'function')
    return props.children({
      isFeatureEnabled: props.isFeatureEnabled,
    });

  if (props.untoggledComponent) {
    return React.createElement(props.untoggledComponent);
  }

  return null;
}

ToggleFeature.displayName = 'ToggleFeature';

export default ToggleFeature;
