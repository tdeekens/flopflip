import React from 'react';
import { getFlagVariation } from '@flopflip/react';
import { FlagName, Flags, FlagVariation } from '@flopflip/types';
import { FlagsContext } from '../../components/flags-context';

export default function useFlagVariations(
  flagNames: FlagName[]
): FlagVariation[] {
  const allFlags: Flags = React.useContext(FlagsContext);

  const flagVariations: FlagVariation[] = flagNames.map(requestedVariation =>
    getFlagVariation(requestedVariation)(allFlags)
  );

  return flagVariations;
}
