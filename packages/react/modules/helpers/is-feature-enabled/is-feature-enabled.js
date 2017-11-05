import { DEFAULT_FLAG_PROP_KEY } from '../../constants';

/**
 * Given a `flagName` and a `flagVariate`
 * indicating if the given feature should be toggled (turned off).
 *
 * @method isFeatureEnabled
 * @param  {String}    flagName                   The flag name (e.g. signup-v2)
 * @param  {Boolean}   [flagVariate=true]         The variate of the flag defaulting to `true`
 * @return {Boolean}                              Indicator if the flag should be toggled
 */
const isFeatureEnabled = (
  flagName = DEFAULT_FLAG_PROP_KEY,
  flagVariate = true
) => props => props[flagName] === flagVariate;

export default isFeatureEnabled;
