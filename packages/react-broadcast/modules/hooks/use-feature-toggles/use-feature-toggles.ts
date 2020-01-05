import React from 'react';
import { getIsFeatureEnabled } from '@flopflip/react';
import { FlagName, Flags, FlagVariation } from '@flopflip/types';
import { FlagsContext } from '../../components/flags-context';

export default function useFeatureToggles(flags: Flags): Error | boolean[] {
  if (typeof React.useContext === 'function') {
    const allFlags: Flags = React.useContext(FlagsContext);

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

  throw new Error(
    'React hooks are not available in your currently installed version of React.'
  );
}
