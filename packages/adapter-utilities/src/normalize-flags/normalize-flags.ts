import type { TFlag, TFlags, TFlagVariation } from '@flopflip/types';

import defaultNormalizeFlag from '../normalize-flag/normalize-flag';

const normalizeFlags = (
  rawFlags: TFlags,
  normalizeFlag: typeof defaultNormalizeFlag = defaultNormalizeFlag
): Record<string, TFlagVariation> =>
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
