import React from 'react';
import { getIsFeatureEnabled } from '@flopflip/react';
import { FlagName, Flags, FlagVariation } from '@flopflip/types';
import { FlagsContext } from '../../components/flags-context';

export default function useFeatureToggle(
  flagName: FlagName,
  flagVariation: FlagVariation = true
): boolean {
  const flags: Flags = React.useContext(FlagsContext);
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
