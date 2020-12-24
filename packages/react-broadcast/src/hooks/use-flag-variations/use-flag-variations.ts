import type { TFlagName, TFlags, TFlagVariation } from '@flopflip/types';

import { useContext } from 'react';
import { getFlagVariation } from '@flopflip/react';
import { FlagsContext } from '../../components/flags-context';

export default function useFlagVariations(
  flagNames: TFlagName[]
): TFlagVariation[] {
  const allFlags: TFlags = useContext(FlagsContext);

  const flagVariations: TFlagVariation[] = flagNames.map((requestedVariation) =>
    getFlagVariation(requestedVariation)(allFlags)
  );

  return flagVariations;
}
