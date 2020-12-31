import type { TFlags, TFlagName, TFlagVariation } from '@flopflip/types';

import { useSelector } from 'react-redux';
import { getIsFeatureEnabled, useAdapterContext } from '@flopflip/react';
import { selectFlags } from '../../ducks/flags';

export default function useFeatureToggles(flags: TFlags) {
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

      return [...previousFlags, isFeatureEnabled];
    },
    []
  );

  return requestedFlags;
}
