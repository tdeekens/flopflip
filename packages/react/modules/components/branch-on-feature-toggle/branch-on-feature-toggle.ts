import { FlagName, FlagVariation } from '@flopflip/types';

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
): ((
  ToggledComponent: React.ComponentType<any>
) => React.ComponentType<any>) => ToggledComponent => {
  const BranchOnFeatureToggle: React.FC<any> = (
    props: any
  ): React.ReactElement<any> => {
    if (isFeatureEnabled(flagName, flagVariation)(props)) {
      return React.createElement(ToggledComponent, props);
    }

    return React.createElement(UntoggledComponent, props);
  };

  return BranchOnFeatureToggle;
};

export default branchOnFeatureToggle;
