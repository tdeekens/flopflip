import type { TFlagName, TFlagVariation, TFlags } from '@flopflip/types';

import { DEFAULT_FLAG_PROP_KEY } from '../../constants';
import getFlagVariation from '../get-flag-variation';

const getIsFeatureEnabled = (
  flagName: TFlagName = DEFAULT_FLAG_PROP_KEY,
  flagVariation: TFlagVariation = true
): ((flags: Readonly<TFlags>) => boolean) => {
  return (flags) => getFlagVariation(flagName)(flags) === flagVariation;
};

export default getIsFeatureEnabled;
