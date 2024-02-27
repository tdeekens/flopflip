import { useAdapterContext } from '@flopflip/react';
import type { TFlags } from '@flopflip/types';
import { useSelector } from 'react-redux';

import { selectFlags } from '../../ducks/flags';

export default function useAllFeatureToggles(): TFlags {
  const adapterContext = useAdapterContext();
  const allFlags = useSelector(selectFlags());

  return adapterContext.adapterEffectIdentifiers.reverse().reduce<TFlags>(
    (_allFlags, adapterIdentifier) => ({
      ..._allFlags,
      ...allFlags[adapterIdentifier],
    }),
    {}
  );
}
