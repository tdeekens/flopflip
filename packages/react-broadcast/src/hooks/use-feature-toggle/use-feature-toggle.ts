import type { TFlagName, TFlagVariation } from '@flopflip/types';

import { useDebugValue } from 'react';
import { getIsFeatureEnabled, useAdapterContext } from '@flopflip/react';
import useFlagsContext from '../use-flags-context';

export default function useFeatureToggle(
  flagName: TFlagName,
  flagVariation: TFlagVariation = true
) {
  const adapterContext = useAdapterContext();
  const flagsContext = useFlagsContext();
  const isFeatureEnabled: boolean = getIsFeatureEnabled(
    adapterContext.adapterEffectIdentifiers,
    flagName,
    flagVariation
  )(flagsContext);

  useDebugValue({
    flagName,
    flagVariation,
    isEnabled: isFeatureEnabled,
  });

  return isFeatureEnabled;
}
