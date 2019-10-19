import { FlagName } from '@flopflip/types';
import camelCase from 'lodash/camelCase';

const getNormalizedFlagName = (flagName: FlagName): FlagName => {
  return camelCase(flagName);
};

export default getNormalizedFlagName;
