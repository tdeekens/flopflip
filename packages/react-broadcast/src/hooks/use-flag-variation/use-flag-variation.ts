import type { TFlagName, TFlagVariation } from '@flopflip/types';

import useFlagVariations from '../use-flag-variations';

export default function useFlagVariation(flagName: TFlagName): TFlagVariation {
  const [flagVariation] = useFlagVariations([flagName]);

  return flagVariation;
}
