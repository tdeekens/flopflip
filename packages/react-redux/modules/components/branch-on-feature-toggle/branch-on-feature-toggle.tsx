import { FlagName, FlagVariation } from '@flopflip/types';

import React from 'react';
import { useFeatureToggle } from '../../hooks';

export default <OwnProps extends object>(
  {
    flag: flagName,
    variation: flagVariation,
  }: { flag: FlagName; variation?: FlagVariation },
  UntoggledComponent?: React.ComponentType
) => (
  ToggledComponent: React.ComponentType<OwnProps>
): React.ComponentType<OwnProps> => {
  const WrappedToggledComponent = (ownProps: OwnProps) => {
    const isFeatureEnabled = useFeatureToggle(flagName, flagVariation);

    if (isFeatureEnabled) return <ToggledComponent {...ownProps} />;
    if (UntoggledComponent) return <UntoggledComponent {...ownProps} />;
    return null;
  };

  return WrappedToggledComponent;
};
