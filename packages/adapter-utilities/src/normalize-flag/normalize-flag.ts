import {
  type TFlag,
  type TFlagName,
  type TFlagVariation,
} from '@flopflip/types';
import camelCase from 'lodash/camelCase';

const normalizeFlag = (
  flagName: TFlagName,
  flagValue?: TFlagVariation
): TFlag => [
  camelCase(flagName),
  // Multi variate flags contain a string or `null` - `false` seems more natural.
  // eslint-disable-next-line no-eq-null, eqeqeq
  flagValue == null ? false : flagValue,
];

export default normalizeFlag;
