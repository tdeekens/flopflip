import type { TFlagName, TFlagVariation } from '@flopflip/types';

import { getFlagVariation, useAdapterContext } from '@flopflip/react';
import useFlagsContext from '../use-flags-context';

export default function useFlagVariations(
  flagNames: TFlagName[]
): TFlagVariation[] {
  const adapterContext = useAdapterContext();
  const flagsContext = useFlagsContext();

  const flagVariations: TFlagVariation[] = flagNames.map((requestedVariation) =>
    getFlagVariation(
      adapterContext.adapterEffectIdentifiers,
      requestedVariation
    )(flagsContext)
  );

  return flagVariations;
}
