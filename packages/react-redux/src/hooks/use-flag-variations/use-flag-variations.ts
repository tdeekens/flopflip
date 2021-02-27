import { getFlagVariation, useAdapterContext } from '@flopflip/react';
import type { TFlagName, TFlagVariation } from '@flopflip/types';
import { useSelector } from 'react-redux';

import { selectFlags } from '../../ducks/flags';

export default function useFlagVariations(
  flagNames: TFlagName[]
): TFlagVariation[] {
  const adapterContext = useAdapterContext();
  const allFlags = useSelector(selectFlags());
  const flagVariations: TFlagVariation[] = flagNames.map((requestedVariation) =>
    getFlagVariation(
      allFlags,
      adapterContext.adapterEffectIdentifiers,
      requestedVariation
    )
  );

  return flagVariations;
}
