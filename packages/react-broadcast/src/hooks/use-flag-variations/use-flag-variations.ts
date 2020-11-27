import type { TFlagName, TFlags, TFlagVariation } from '@flopflip/types';

import React from 'react';
import { getFlagVariation } from '@flopflip/react';
import { FlagsContext } from '../../components/flags-context';

export default function useFlagVariations(
  flagNames: TFlagName[]
): TFlagVariation[] {
  const allFlags: TFlags = React.useContext(FlagsContext);

  const flagVariations: TFlagVariation[] = flagNames.map((requestedVariation) =>
    getFlagVariation(requestedVariation)(allFlags)
  );

  return flagVariations;
}
