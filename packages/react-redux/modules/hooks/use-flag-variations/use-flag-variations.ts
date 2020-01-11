import { FlagName, FlagVariation } from '@flopflip/types';

import { getFlagVariation } from '@flopflip/react';
import { useSelector } from 'react-redux';
import { selectFlags } from '../../ducks/flags';

export default function useFlagVariations(
  flagNames: FlagName[]
): FlagVariation[] {
  const allFlags = useSelector(selectFlags);

  const flagVariations: FlagVariation[] = flagNames.map(requestedVariation =>
    getFlagVariation(requestedVariation)(allFlags)
  );

  return flagVariations;
}
