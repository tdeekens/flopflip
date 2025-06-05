import type { TFlagName } from '@flopflip/types';
import kebabCase from 'lodash/kebabCase.js';

const denormalizeFlagName = (flagName: TFlagName) => kebabCase(flagName);

export { denormalizeFlagName };
