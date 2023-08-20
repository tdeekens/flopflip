import {
  ToggleFeature as SharedToggleFeature,
  type TToggleFeatureProps,
} from '@flopflip/react';
import { type TFlagName, type TFlagVariation } from '@flopflip/types';
import React from 'react';

import { useFeatureToggle } from '../../hooks/';

type Props = {
  flag: TFlagName;
  variation?: TFlagVariation;
} & Omit<TToggleFeatureProps, 'isFeatureEnabled'>;

function ToggleFeature<OwnProps extends Props>(props: OwnProps) {
  const isFeatureEnabled = useFeatureToggle(props.flag, props.variation);

  // @ts-expect-error return type matches
  return <SharedToggleFeature {...props} isFeatureEnabled={isFeatureEnabled} />;
}

ToggleFeature.displayName = 'ToggleFeature';

export default ToggleFeature;
