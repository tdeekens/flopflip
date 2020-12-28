import type { TFlagName, TFlags, TFlagVariation } from '@flopflip/types';

import { getIsFeatureEnabled, useAdapterContext } from '@flopflip/react';
import useFlagsContext from '../use-flags-context';

export default function useFeatureToggles(flags: TFlags) {
  const adapterContext = useAdapterContext();
  const flagsContext = useFlagsContext();
  const requestedFlags: boolean[] = Object.entries(flags).reduce<boolean[]>(
    (previousFlags, [flagName, flagVariation]: [TFlagName, TFlagVariation]) => {
      const isFeatureEnabled: boolean = getIsFeatureEnabled(
        adapterContext.adapterInterfaceIdentifiers,
        flagName,
        flagVariation
      )(flagsContext);

      return [...previousFlags, isFeatureEnabled];
    },
    []
  );

  return requestedFlags;
}
