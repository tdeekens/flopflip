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

function ToggleFeature({
  untoggledComponent,
  toggledComponent,
  render,
  children,
  isFeatureEnabled,
}: TProps) {
  if (untoggledComponent) {
    warning(
      isValidElementType(untoggledComponent),
      `Invalid prop 'untoggledComponent' supplied to 'ToggleFeature': the prop is not a valid React component`
    );
  }

  if (toggledComponent) {
    warning(
      isValidElementType(toggledComponent),
      `Invalid prop 'toggledComponent' supplied to 'ToggleFeature': the prop is not a valid React component`
    );
  }

  if (isFeatureEnabled) {
    if (toggledComponent) {
      return React.createElement(toggledComponent);
    }

    if (children) {
      if (typeof children === 'function') {
        return children({
          isFeatureEnabled,
        });
      }
      return React.Children.only<React.ReactNode>(children);
    }

    if (typeof render === 'function') {
      return render();
    }
  }

  if (typeof children === 'function') {
    return children({
      isFeatureEnabled,
    });
  }

  if (untoggledComponent) {
    return React.createElement(untoggledComponent);
  }

  return null;
}

ToggleFeature.displayName = 'ToggleFeature';

export default ToggleFeature;
