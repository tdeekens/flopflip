import React from 'react';
import { getIsFeatureEnabled, getFlagVariation } from '@flopflip/react';
import { FlagsContext } from '../../components/flags-context';

import { FlagName, Flags, FlagVariation } from '@flopflip/types';

export default function useFeatureToggle(
  flagName: FlagName,
  flagVariation: FlagVariation | null = true
): FlagVariation {
  const flags: Flags = React.useContext(FlagsContext);
  let actualFlagVariation: FlagVariation = getFlagVariation(flagName)(flags);

  // NOTE: When passed the requested flag variation is evaluated against the actual
  if (flagVariation)
    actualFlagVariation = getIsFeatureEnabled(flagName, flagVariation)(flags);

  React.useDebugValue({
    flagName,
    flagVariation,
    actualFlagVariation,
  });

  return actualFlagVariation;
}
