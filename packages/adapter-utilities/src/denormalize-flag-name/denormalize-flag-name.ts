import type { TFlagName } from '@flopflip/types';
import kebabCase from 'lodash/kebabCase';

const denormalizeFlagName = (flagName: TFlagName) => kebabCase(flagName);

export default denormalizeFlagName;
