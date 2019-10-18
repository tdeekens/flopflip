import { FlagName, FlagVariation, Flags } from '@flopflip/types';
import warning from 'tiny-warning';
import { DEFAULT_FLAG_PROP_KEY } from '../../constants';
import getNormalizedFlagName from '../get-normalized-flag-name';

/**
 * Given a `flagName` and a `flagVariation`
 * indicating if the given feature should be toggled (turned off).
 *
 * @method isFeatureEnabled
 * @param  {String}    flagName                   The flag name (e.g. signup-v2)
 * @param  {Boolean}   [flagVariation=true]       The variation of the flag defaulting to `true`
 * @return {Boolean}                              Indicator if the flag should be toggled
 */
const getIsFeatureEnabled = (
  flagName: FlagName = DEFAULT_FLAG_PROP_KEY,
  flagVariation: FlagVariation = true
): ((flags: Flags) => boolean) => {
  const normalizedFlagName = getNormalizedFlagName(flagName);

  warning(
    normalizedFlagName === flagName,
    '@flopflip/react: passed flag name does not seem to be normalized which may result in unexpected toggling. Please refer to our readme for more information: https://github.com/tdeekens/flopflip#flag-normalization'
  );

  return flags => flags[flagName] === flagVariation;
};

export default getIsFeatureEnabled;
