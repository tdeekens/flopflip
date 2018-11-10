// @flow

import type { FlagName, FlagVariation } from '@flopflip/types';

import React, { Component, createElement, type ComponentType } from 'react';
import isFeatureEnabled from '../../helpers/is-feature-enabled';
import { DEFAULT_FLAG_PROP_KEY } from '../../constants';

class DefaultUntoggledComponent extends Component<{}> {
  render() {
    return null;
  }
}

const branchOnFeatureToggle = (
  UntoggledComponent: ComponentType<any> = DefaultUntoggledComponent,
  flagName: FlagName = DEFAULT_FLAG_PROP_KEY,
  flagVariation: FlagVariation = true
) => (ToggledComponent: ComponentType<any>): ComponentType<any> => {
  const BranchOnFeatureToggle: ComponentType<any> = (props: Object) => {
    if (isFeatureEnabled(flagName, flagVariation)(props)) {
      return createElement(ToggledComponent);
    } else {
      return createElement(UntoggledComponent);
    }
  };

  return BranchOnFeatureToggle;
};

export default branchOnFeatureToggle;
