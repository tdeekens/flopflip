import type { TFlagName, TFlagVariation } from '@flopflip/types';

import { getFlagVariation, useAdapterContext } from '@flopflip/react';
import { useSelector } from 'react-redux';
import { selectFlags } from '../../ducks/flags';

export default function useFlagVariations(
  flagNames: TFlagName[]
): TFlagVariation[] {
  const adapterContext = useAdapterContext();
  const allFlags = useSelector(selectFlags());
  const flagVariations: TFlagVariation[] = flagNames.map((requestedVariation) =>
    getFlagVariation(
      adapterContext.adapterEffectIdentifiers,
      requestedVariation
    )(allFlags)
  );

  return flagVariations;
}
