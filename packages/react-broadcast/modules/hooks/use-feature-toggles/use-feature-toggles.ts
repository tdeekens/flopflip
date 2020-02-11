import React from 'react';
import { getIsFeatureEnabled } from '@flopflip/react';
import { TFlagName, TFlags, TFlagVariation } from '@flopflip/types';
import { FlagsContext } from '../../components/flags-context';

export default function useFeatureToggles(flags: TFlags) {
  const allFlags: TFlags = React.useContext(FlagsContext);

  const requestedFlags: boolean[] = Object.entries(flags).reduce<boolean[]>(
    (previousFlags, [flagName, flagVariation]: [TFlagName, TFlagVariation]) => {
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
