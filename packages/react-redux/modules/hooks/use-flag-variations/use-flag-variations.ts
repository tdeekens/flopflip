import { TFlagName, TFlagVariation } from '@flopflip/types';

import { getFlagVariation } from '@flopflip/react';
import { useSelector } from 'react-redux';
import { selectFlags } from '../../ducks/flags';

export default function useFlagVariations(flagNames: Readonly<TFlagName[]>) {
  const allFlags = useSelector(selectFlags);

  const flagVariations: TFlagVariation[] = flagNames.map((requestedVariation) =>
    getFlagVariation(requestedVariation)(allFlags)
  );

  return flagVariations;
}
