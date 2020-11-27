import type { TFlagName, TFlags, TFlagVariation } from '@flopflip/types';

import React from 'react';
import { getIsFeatureEnabled } from '@flopflip/react';
import { FlagsContext } from '../../components/flags-context';

export default function useFeatureToggles(flags: TFlags) {
  const allFlags: TFlags = React.useContext(FlagsContext);

  const requestedFlags: boolean[] = Object.entries(flags).reduce<boolean[]>(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
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
