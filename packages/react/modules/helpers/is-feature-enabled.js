export const defaultFlagName = 'isFeatureEnabled';

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
  flagName = defaultFlagName,
  flagVariate = true
) => props => props[flagName] === flagVariate;

export default isFeatureEnabled;
