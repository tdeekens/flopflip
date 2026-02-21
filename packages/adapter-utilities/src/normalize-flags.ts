import type { TFlag, TFlags, TFlagVariation } from '@flopflip/types';

import { normalizeFlag as defaultNormalizeFlag } from './normalize-flag';

const normalizeFlags = (
  rawFlags: TFlags,
  normalizer: typeof defaultNormalizeFlag = defaultNormalizeFlag,
): Record<string, TFlagVariation> =>
  Object.entries(rawFlags || {}).reduce<TFlags>(
    (normalizedFlags: TFlags, [flagName, flagValue]) => {
      const [normalizedFlagName, normalizedFlagValue]: TFlag = normalizer(
        flagName,
        flagValue,
      );
      // Can't return expression as it is the assigned value
      normalizedFlags[normalizedFlagName] = normalizedFlagValue;

      return normalizedFlags;
    },
    {},
  );

export { normalizeFlags };
