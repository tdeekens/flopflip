import { getFlagVariation, useAdapterContext } from '@flopflip/react';
import type { TFlagName, TFlagVariation } from '@flopflip/types';

import { useFlagsContext } from './use-flags-context';

function useFlagVariations(
  flagNames: (TFlagName | undefined)[],
): TFlagVariation[] {
  const adapterContext = useAdapterContext();
  const flagsContext = useFlagsContext();

  const flagVariations: TFlagVariation[] = flagNames.map((requestedVariation) =>
    getFlagVariation(
      flagsContext,
      adapterContext.adapterEffectIdentifiers,
      requestedVariation,
    ),
  );

  return flagVariations;
}

export { useFlagVariations };
