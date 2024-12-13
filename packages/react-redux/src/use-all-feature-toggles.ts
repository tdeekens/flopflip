import { useAdapterContext } from '@flopflip/react';
import type { TFlags } from '@flopflip/types';
import { useSelector } from 'react-redux';

import { selectFlags } from './ducks/flags';

function useAllFeatureToggles(): TFlags {
  const adapterContext = useAdapterContext();
  const allFlags = useSelector(selectFlags());
  const reversedAdapterEffectIdentifiers = [
    ...adapterContext.adapterEffectIdentifiers,
  ].reverse();

  return reversedAdapterEffectIdentifiers.reduce<TFlags>(
    (_allFlags, adapterIdentifier) => ({
      ..._allFlags,
      ...allFlags[adapterIdentifier],
    }),
    {}
  );
}

export { useAllFeatureToggles };
