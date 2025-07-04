import type {
  TAdapterIdentifiers,
  TFlagName,
  TFlagsContext,
  TFlagVariation,
} from '@flopflip/types';
import warning from 'tiny-warning';

import { DEFAULT_FLAG_PROP_KEY } from './constants';
import { getNormalizedFlagName } from './get-normalized-flag-name';
import { isNil } from './is-nil';

const getFlagVariation = (
  allFlags: TFlagsContext,
  adapterIdentifiers: TAdapterIdentifiers[],
  flagName: TFlagName = DEFAULT_FLAG_PROP_KEY
): TFlagVariation => {
  const normalizedFlagName = getNormalizedFlagName(flagName);

  warning(
    normalizedFlagName === flagName,
    '@flopflip/react: passed flag name does not seem to be normalized which may result in unexpected toggling. Please refer to our readme for more information: https://github.com/tdeekens/flopflip#flag-normalization'
  );

  for (const adapterInterfaceIdentifier of adapterIdentifiers) {
    const flagVariation =
      allFlags[adapterInterfaceIdentifier]?.[normalizedFlagName];

    if (!isNil(flagVariation)) {
      return flagVariation;
    }
  }

  return false;
};

export { getFlagVariation };
