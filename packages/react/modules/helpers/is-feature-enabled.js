import isNil from 'lodash.isnil';

export const defaultFlagName = 'isFeatureEnabled';

/**
 * Given a `flagName`, a `flagVariate` and a `defaultVariateValue` returns
 * indicating if the given feature should be toggled (turned off).
 *
 * @method isFeatureEnabled
 * @param  {String}    flagName                   The flag name (e.g. signup-v2)
 * @param  {Boolean}   [flagVariate=true]         The variate of the flag defaulting to `true`
 * @param  {Boolean}   [defaultVariateValue=true] The default variate value of the flag defaulting to `true` (e.g. if flag does not exist)
 * @return {Boolean}                              Indicator if the flag should be toggled
 */
const isFeatureEnabled = (
  flagName = defaultFlagName,
  flagVariate = true,
  defaultVariateValue
) => props =>
  isNil(props[flagName]) && !isNil(defaultVariateValue)
    ? defaultVariateValue === flagVariate
    : props[flagName] === flagVariate;

export default isFeatureEnabled;
