import type { TFlagName } from '@flopflip/types';
import camelCase from 'lodash/camelCase.js';

const getNormalizedFlagName = (flagName: TFlagName): TFlagName =>
  camelCase(flagName);

export { getNormalizedFlagName };
