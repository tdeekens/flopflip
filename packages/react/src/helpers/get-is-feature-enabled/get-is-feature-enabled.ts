import type {
  TFlagName,
  TFlagVariation,
  TFlagsContext,
  TAdapterIdentifiers,
} from '@flopflip/types';

import { DEFAULT_FLAG_PROP_KEY } from '../../constants';
import getFlagVariation from '../get-flag-variation';

const getIsFeatureEnabled = (
  allFlags: TFlagsContext,
  adapterIdentifiers: TAdapterIdentifiers[],
  flagName: TFlagName = DEFAULT_FLAG_PROP_KEY,
  flagVariation: TFlagVariation = true
) => {
  return (
    getFlagVariation(allFlags, adapterIdentifiers, flagName) === flagVariation
  );
};

export default getIsFeatureEnabled;
