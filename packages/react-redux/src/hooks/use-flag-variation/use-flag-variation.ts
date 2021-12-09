import { type TFlagName, type TFlagVariation } from '@flopflip/types';

import useFlagVariations from '../use-flag-variations';

export default function useFlagVariation(flagName?: TFlagName): TFlagVariation {
  if (!flagName) return false;

  const [flagVariation] = useFlagVariations([flagName]);

  return flagVariation;
}
