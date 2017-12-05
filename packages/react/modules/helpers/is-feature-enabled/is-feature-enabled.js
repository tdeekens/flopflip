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
  flagName = DEFAULT_FLAG_PROP_KEY,
  flagVariation = true
) => props => props[flagName] === flagVariation;

export default isFeatureEnabled;
