import type { TFlagName, TFlags, TFlagVariation } from '@flopflip/types';

import { useContext, useDebugValue } from 'react';
import { getIsFeatureEnabled } from '@flopflip/react';
import { FlagsContext } from '../../components/flags-context';

export default function useFeatureToggle(
  flagName: TFlagName,
  flagVariation: TFlagVariation = true
) {
  const flags: TFlags = useContext(FlagsContext);
  const isFeatureEnabled: boolean = getIsFeatureEnabled(
    flagName,
    flagVariation
  )(flags);

  useDebugValue({
    flagName,
    flagVariation,
    isEnabled: isFeatureEnabled,
  });

  return isFeatureEnabled;
}
