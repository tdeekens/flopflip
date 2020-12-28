import type {
  TFlagName,
  TFlagVariation,
  TFlagsContext,
  TAdapterIdentifiers,
} from '@flopflip/types';

import { DEFAULT_FLAG_PROP_KEY } from '../../constants';
import getFlagVariation from '../get-flag-variation';

const getIsFeatureEnabled = (
  adapterIdentifiers: TAdapterIdentifiers[],
  flagName: TFlagName = DEFAULT_FLAG_PROP_KEY,
  flagVariation: TFlagVariation = true
): ((flags: TFlagsContext) => boolean) => {
  return (flags) =>
    getFlagVariation(adapterIdentifiers, flagName)(flags) === flagVariation;
};

export default getIsFeatureEnabled;
