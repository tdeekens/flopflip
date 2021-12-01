import { type TFlagName, type TFlagVariation } from '@flopflip/types';
import React from 'react';

import { useFeatureToggle } from '../../hooks';

type TBranchOnFeatureToggleOptions = {
  flag: TFlagName;
  variation?: TFlagVariation;
};
export default function branchOnFeatureToggle<
  OwnProps extends Record<string, unknown>
>(
  { flag: flagName, variation: flagVariation }: TBranchOnFeatureToggleOptions,
  UntoggledComponent?: React.ComponentType
) {
  return (ToggledComponent: React.ComponentType<OwnProps>) => {
    const WrappedToggledComponent = (ownProps: OwnProps) => {
      const isFeatureEnabled = useFeatureToggle(flagName, flagVariation);

      if (isFeatureEnabled) return <ToggledComponent {...ownProps} />;
      if (UntoggledComponent) return <UntoggledComponent {...ownProps} />;
      return null;
    };

    return WrappedToggledComponent;
  };
}
