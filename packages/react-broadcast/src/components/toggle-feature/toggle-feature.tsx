import {
  ToggleFeature as SharedToggleFeature,
  TToggleFeatureProps,
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
  return <SharedToggleFeature {...props} isFeatureEnabled={isFeatureEnabled} />;
}

ToggleFeature.displayName = 'ToggleFeature';

export default ToggleFeature;
