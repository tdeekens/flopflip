import { getIsFeatureEnabled, useAdapterContext } from '@flopflip/react';
import { type TFlagName, type TFlagVariation } from '@flopflip/types';
import { useDebugValue } from 'react';

import useFlagsContext from '../use-flags-context';

export default function useFeatureToggle(
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
