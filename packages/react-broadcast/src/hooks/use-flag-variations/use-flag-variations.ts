import { getFlagVariation, useAdapterContext } from '@flopflip/react';
import { type TFlagName, type TFlagVariation } from '@flopflip/types';

import useFlagsContext from '../use-flags-context';

export default function useFlagVariations(
  flagNames: Array<TFlagName | undefined>
): TFlagVariation[] {
  const adapterContext = useAdapterContext();
  const flagsContext = useFlagsContext();

  const flagVariations: TFlagVariation[] = flagNames.map((requestedVariation) =>
    getFlagVariation(
      flagsContext,
      adapterContext.adapterEffectIdentifiers,
      requestedVariation
    )
  );

  return flagVariations;
}
