import { FlagName, FlagVariation, Flags } from '@flopflip/types';
import { DEFAULT_FLAG_PROP_KEY } from '../../constants';
import getFlagVariation from '../get-flag-variation';

const getIsFeatureEnabled = (
  flagName: FlagName = DEFAULT_FLAG_PROP_KEY,
  flagVariation: FlagVariation = true
): ((flags: Flags) => boolean) => {
  return flags => getFlagVariation(flagName)(flags) === flagVariation;
};

export default getIsFeatureEnabled;
