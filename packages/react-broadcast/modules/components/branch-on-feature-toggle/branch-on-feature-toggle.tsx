import type { TFlagName, TFlagVariation } from '@flopflip/types';

import React from 'react';
import { useFeatureToggle } from '../../hooks';

export default function branchOnFeatureToggle<OwnProps extends object>(
  {
    flag: flagName,
    variation: flagVariation,
  }: { flag: TFlagName; variation?: TFlagVariation },
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
