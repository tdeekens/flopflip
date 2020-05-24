import type { TFlagName } from '@flopflip/types';

import useFlagVariations from '../use-flag-variations';

export default function useFlagVariation(flagName: Readonly<TFlagName>) {
  const [flagVariation] = useFlagVariations([flagName]);

  return flagVariation;
}
