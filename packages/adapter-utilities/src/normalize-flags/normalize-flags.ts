import type { TFlagVariation, TFlag, TFlags } from '@flopflip/types';
import normalizeFlag from '../normalize-flag/normalize-flag';

const normalizeFlags = (rawFlags: TFlags): Record<string, TFlagVariation> =>
  Object.entries(rawFlags || {}).reduce<TFlags>(
    (normalizedFlags: TFlags, [flagName, flagValue]) => {
      const [normalizedFlagName, normalizedFlagValue]: TFlag = normalizeFlag(
        flagName,
        flagValue
      );
      // Can't return expression as it is the assigned value
      normalizedFlags[normalizedFlagName] = normalizedFlagValue;

      return normalizedFlags;
    },
    {}
  );

export default normalizeFlags;
