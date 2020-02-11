import { TFlagName, TFlagVariation } from '@flopflip/types';

import React from 'react';
import { useSelector } from 'react-redux';
import { getIsFeatureEnabled } from '@flopflip/react';
import { selectFlags } from '../../ducks/flags';

export default function useFeatureToggle(
  flagName: TFlagName,
  flagVariation: TFlagVariation = true
) {
  const flags = useSelector(selectFlags);
  const isFeatureEnabled: boolean = getIsFeatureEnabled(
    flagName,
    flagVariation
  )(flags);

  React.useDebugValue({
    flagName,
    flagVariation,
    isEnabled: isFeatureEnabled,
  });

  return isFeatureEnabled;
}
