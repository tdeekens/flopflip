import { useAdapterContext } from '@flopflip/react';
import type { TFlags } from '@flopflip/types';

import { useFlagsContext } from './use-flags-context';

function useAllFeatureToggles(): TFlags {
  const adapterContext = useAdapterContext();
  const flagsContext = useFlagsContext();
  const reversedAdapterEffectIdentifiers = [
    ...adapterContext.adapterEffectIdentifiers,
  ].reverse();

  return reversedAdapterEffectIdentifiers.reduce<TFlags>(
    (_allFlags, adapterIdentifier) => ({
      ..._allFlags,
      ...flagsContext[adapterIdentifier],
    }),
    {}
  );
}

export { useAllFeatureToggles };
