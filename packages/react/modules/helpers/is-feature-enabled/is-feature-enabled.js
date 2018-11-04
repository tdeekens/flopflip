// @flow

import type { FlagName, FlagVariation, Flags } from '@flopflip/types';
import camelCase from 'lodash.camelcase';
import warning from 'warning';
import { DEFAULT_FLAG_PROP_KEY } from '../../constants';

/**
 * Given a `flagName` and a `flagVariation`
 * indicating if the given feature should be toggled (turned off).
 *
 * @method isFeatureEnabled
 * @param  {String}    flagName                   The flag name (e.g. signup-v2)
 * @param  {Boolean}   [flagVariation=true]       The variation of the flag defaulting to `true`
 * @return {Boolean}                              Indicator if the flag should be toggled
 */
const isFeatureEnabled = (
  flagName: FlagName = DEFAULT_FLAG_PROP_KEY,
  flagVariation: FlagVariation = true
) => {
  warning(
    flagName === camelCase(flagName),
    '@flopflip/react: passed flag name does not seem to be normalized which may result in unexpected toggling. Please refer to our readme for more information: https://github.com/tdeekens/flopflip#flag-normalization'
  );

  return (flags: Flags) => flags[flagName] === flagVariation;
};

export default isFeatureEnabled;
