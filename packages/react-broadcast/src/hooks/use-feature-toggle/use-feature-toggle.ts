import { getIsFeatureEnabled, useAdapterContext } from '@flopflip/react';
import type { TFlagName, TFlagVariation } from '@flopflip/types';
import { useDebugValue } from 'react';

import { useFlagsContext } from '../use-flags-context';

function useFeatureToggle(
  flagName: TFlagName,
  flagVariation: TFlagVariation = true
) {
  const adapterContext = useAdapterContext();
  const flagsContext = useFlagsContext();
  const isFeatureEnabled: boolean = getIsFeatureEnabled(
    flagsContext,
    adapterContext.adapterEffectIdentifiers,
    flagName,
    flagVariation
  );

  useDebugValue({
    flagName,
    flagVariation,
    isEnabled: isFeatureEnabled,
  });

  return isFeatureEnabled;
}

export { useFeatureToggle };
