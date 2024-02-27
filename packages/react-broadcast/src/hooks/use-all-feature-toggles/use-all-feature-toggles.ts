import { useAdapterContext } from '@flopflip/react';
import type { TFlags } from '@flopflip/types';

import useFlagsContext from '../use-flags-context';

export default function useAllFeatureToggles(): TFlags {
  const adapterContext = useAdapterContext();
  const flagsContext = useFlagsContext();

  return adapterContext.adapterEffectIdentifiers.reverse().reduce<TFlags>(
    (_allFlags, adapterIdentifier) => ({
      ..._allFlags,
      ...flagsContext[adapterIdentifier],
    }),
    {}
  );
}
