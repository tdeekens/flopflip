import { getIsFeatureEnabled, useAdapterContext } from '@flopflip/react';
import { type TFlags } from '@flopflip/types';

import useFlagsContext from '../use-flags-context';

export default function useAllFeatureToggles(): TFlags {
  const adapterContext = useAdapterContext();
  const flagsContext = useFlagsContext();
  const enabledFlags: TFlags = Object.values(flagsContext).reduce<TFlags>(
    (_enabledFlags, flags) => {
      Object.keys(flags).forEach((featureName) => {
        if (
          getIsFeatureEnabled(
            flagsContext,
            adapterContext.adapterEffectIdentifiers,
            featureName
          )
        ) {
          _enabledFlags[featureName] = true;
        }
      });
      return _enabledFlags;
    },
    {}
  );

  return enabledFlags;
}
