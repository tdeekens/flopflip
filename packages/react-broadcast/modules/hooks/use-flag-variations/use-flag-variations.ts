import React from 'react';
import { getFlagVariation } from '@flopflip/react';
import { TFlagName, TFlags, TFlagVariation } from '@flopflip/types';
import { FlagsContext } from '../../components/flags-context';

export default function useFlagVariations(flagNames: TFlagName[]) {
  const allFlags: TFlags = React.useContext(FlagsContext);

  const flagVariations: TFlagVariation[] = flagNames.map(requestedVariation =>
    getFlagVariation(requestedVariation)(allFlags)
  );

  return flagVariations;
}
