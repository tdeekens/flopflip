import { getIsFeatureEnabled, useAdapterContext } from '@flopflip/react';
import { type TFlags } from '@flopflip/types';
import { useSelector } from 'react-redux';

import { selectFlags } from '../../ducks/flags';

export default function useAllFeatureToggles(): TFlags {
  const allFlags = useSelector(selectFlags());
  const adapterContext = useAdapterContext();

  const enabledFlags: TFlags = Object.values(allFlags).reduce<TFlags>(
    (_enabledFlags, flags) => {
      Object.keys(flags).forEach((featureName) => {
        if (
          getIsFeatureEnabled(
            allFlags,
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
