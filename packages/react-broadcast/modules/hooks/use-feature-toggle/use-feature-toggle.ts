import React from 'react';
import { getIsFeatureEnabled } from '@flopflip/react';
import { TFlagName, TFlags, TFlagVariation } from '@flopflip/types';
import { FlagsContext } from '../../components/flags-context';

export default function useFeatureToggle(
  flagName: TFlagName,
  flagVariation: TFlagVariation = true
): boolean {
  const flags: TFlags = React.useContext(FlagsContext);
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
