import { TFlagName } from '@flopflip/types';
import camelCase from 'lodash/camelCase';

const getNormalizedFlagName = (flagName: TFlagName): TFlagName => {
  return camelCase(flagName);
};

export default getNormalizedFlagName;
