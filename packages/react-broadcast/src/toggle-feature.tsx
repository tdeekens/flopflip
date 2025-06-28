import {
  ToggleFeature as SharedToggleFeature,
  type TToggleFeatureProps,
} from '@flopflip/react';
import type { TFlagName, TFlagVariation } from '@flopflip/types';
// biome-ignore lint/correctness/noUnusedImports: false positive
import React from 'react';

import { useFeatureToggle } from './use-feature-toggle';

type TProps = {
  flag: TFlagName;
  variation?: TFlagVariation;
} & Omit<TToggleFeatureProps, 'isFeatureEnabled'>;

function ToggleFeature<OwnProps extends TProps>({
  flag,
  variation,
  ...remainingProps
}: OwnProps) {
  const isFeatureEnabled = useFeatureToggle(flag, variation);

  return (
    <SharedToggleFeature
      flag={flag}
      variation={variation}
      {...remainingProps}
      isFeatureEnabled={isFeatureEnabled}
    />
  );
}

ToggleFeature.displayName = 'ToggleFeature';

export { ToggleFeature };
