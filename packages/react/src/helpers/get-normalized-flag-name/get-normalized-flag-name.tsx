import { type TFlagName } from '@flopflip/types';
import camelCase from 'lodash/camelCase';

const getNormalizedFlagName = (flagName: TFlagName): TFlagName =>
  camelCase(flagName);

export default getNormalizedFlagName;
