// @flow

import { FlagName, FlagVariation } from '@flopflip/types';

import React from 'react';
import isFeatureEnabled from '../../helpers/is-feature-enabled';
import { DEFAULT_FLAG_PROP_KEY } from '../../constants';

class DefaultUntoggledComponent extends React.Component<{}> {
  render() {
    return null;
  }
}

const branchOnFeatureToggle = (
  UntoggledComponent: React.ComponentType<any> = DefaultUntoggledComponent,
  flagName: FlagName = DEFAULT_FLAG_PROP_KEY,
  flagVariation: FlagVariation = true
) => (ToggledComponent: React.ComponentType<any>): React.ComponentType<any> => {
  const BranchOnFeatureToggle: React.ComponentType<any> = (props: Object) => {
    if (isFeatureEnabled(flagName, flagVariation)(props)) {
      return React.createElement(ToggledComponent, props);
    } else {
      return React.createElement(UntoggledComponent, props);
    }
  };

  return BranchOnFeatureToggle;
};

export default branchOnFeatureToggle;
