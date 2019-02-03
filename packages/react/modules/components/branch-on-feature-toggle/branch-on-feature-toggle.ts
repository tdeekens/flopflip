import { FlagName, FlagVariation, Flags } from '@flopflip/types';

import React from 'react';
import isFeatureEnabled from '../../helpers/is-feature-enabled';
import { DEFAULT_FLAG_PROP_KEY } from '../../constants';

class DefaultUntoggledComponent extends React.Component<{}> {
  render(): React.ReactNode {
    return null;
  }
}

const branchOnFeatureToggle = (
  UntoggledComponent: React.ComponentType<any> = DefaultUntoggledComponent,
  flagName: FlagName = DEFAULT_FLAG_PROP_KEY,
  flagVariation: FlagVariation = true
) => (ToggledComponent: React.ComponentType<any>): React.ComponentType<any> => {
  const BranchOnFeatureToggle: React.ComponentType<any> = (props: Flags) => {
    if (isFeatureEnabled(flagName, flagVariation)(props)) {
      return React.createElement(ToggledComponent, props);
    }

    return React.createElement(UntoggledComponent, props);
  };

  return BranchOnFeatureToggle;
};

export default branchOnFeatureToggle;
