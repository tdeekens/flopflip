import { Flags, FlagName, FlagVariation } from '@flopflip/types';

import { useSelector } from 'react-redux';
import { getIsFeatureEnabled } from '@flopflip/react';
import { selectFlags } from '../../ducks/flags';

export default function useFeatureToggles(flags: Flags): boolean[] {
  const allFlags = useSelector(selectFlags);

  const requestedFlags: boolean[] = Object.entries(flags).reduce<boolean[]>(
    (previousFlags, [flagName, flagVariation]: [FlagName, FlagVariation]) => {
      const isFeatureEnabled: boolean = getIsFeatureEnabled(
        flagName,
        flagVariation
      )(allFlags);

      return [...previousFlags, isFeatureEnabled];
    },
    []
  );

  return requestedFlags;
}
