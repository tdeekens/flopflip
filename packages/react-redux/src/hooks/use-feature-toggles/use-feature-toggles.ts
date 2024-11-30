import { getIsFeatureEnabled, useAdapterContext } from '@flopflip/react';
import type { TFlagName, TFlagVariation, TFlags } from '@flopflip/types';
import { useSelector } from 'react-redux';

import { selectFlags } from '../../ducks/flags';

function useFeatureToggles(flags: TFlags) {
  const allFlags = useSelector(selectFlags());
  const adapterContext = useAdapterContext();

  const requestedFlags: boolean[] = Object.entries(flags).reduce<boolean[]>(
    (previousFlags, [flagName, flagVariation]: [TFlagName, TFlagVariation]) => {
      const isFeatureEnabled: boolean = getIsFeatureEnabled(
        allFlags,
        adapterContext.adapterEffectIdentifiers,
        flagName,
        flagVariation
      );

      previousFlags.push(isFeatureEnabled);

      return previousFlags;
    },
    []
  );

  return requestedFlags;
}

export { useFeatureToggles };
