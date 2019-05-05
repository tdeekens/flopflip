import React from 'react';
import { FlagName, Flags, FlagVariation } from '@flopflip/types';
import getIsFeatureEnabled from '../../helpers/get-is-feature-enabled';
import { DEFAULT_FLAG_PROP_KEY } from '../../constants';

class DefaultUntoggledComponent extends React.Component<any> {
  render(): React.ReactNode {
    return null;
  }
}

const branchOnFeatureToggle = <Props extends object>(
  UntoggledComponent: React.ComponentType<any> = DefaultUntoggledComponent,
  flagName: FlagName = DEFAULT_FLAG_PROP_KEY,
  flagVariation: FlagVariation = true
) => (
  ToggledComponent: React.ComponentType<Props>
): React.ComponentType<Props> => {
  const BranchOnFeatureToggle: React.FC<Props> = (
    props: Props
  ): React.ReactElement<Props> => {
    if (getIsFeatureEnabled(flagName, flagVariation)(props as Flags)) {
      return React.createElement(ToggledComponent, props);
    }

    return React.createElement(UntoggledComponent, props);
  };

  return BranchOnFeatureToggle;
};

export default branchOnFeatureToggle;
