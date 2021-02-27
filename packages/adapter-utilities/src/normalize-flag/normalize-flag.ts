import type { TFlag, TFlagName, TFlagVariation } from '@flopflip/types';
import camelCase from 'lodash/camelCase';

const normalizeFlag = (
  flagName: TFlagName,
  flagValue?: TFlagVariation
): TFlag => [
  camelCase(flagName),
  // Multi variate flags contain a string or `null` - `false` seems more natural.
  flagValue === null || flagValue === undefined ? false : flagValue,
];

export default normalizeFlag;
