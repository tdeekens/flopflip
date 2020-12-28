import type {
  TFlagName,
  TFlagVariation,
  TFlagsContext,
  TAdapterInterfaceIdentifiers,
} from '@flopflip/types';

import { DEFAULT_FLAG_PROP_KEY } from '../../constants';
import getFlagVariation from '../get-flag-variation';

const getIsFeatureEnabled = (
  adapterInterfaceIdentifiers: TAdapterInterfaceIdentifiers[],
  flagName: TFlagName = DEFAULT_FLAG_PROP_KEY,
  flagVariation: TFlagVariation = true
): ((flags: TFlagsContext) => boolean) => {
  return (flags) =>
    getFlagVariation(adapterInterfaceIdentifiers, flagName)(flags) ===
    flagVariation;
};

export default getIsFeatureEnabled;
