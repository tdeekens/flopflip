import { TFlagName, TFlagVariation } from '@flopflip/types';

import React from 'react';
import { ToggleFeature as SharedToggleFeature } from '@flopflip/react';
import { useFeatureToggle } from '../../hooks/';

type Props = {
  flag: TFlagName;
  variation: TFlagVariation;
};

const ToggleFeature = <OwnProps extends Props>(
  props: OwnProps
): React.ReactNode => {
  const isFeatureEnabled = useFeatureToggle(props.flag, props.variation);

  // @ts-ignore
  return <SharedToggleFeature {...props} isFeatureEnabled={isFeatureEnabled} />;
};

ToggleFeature.displayName = 'ToggleFeature';

export default ToggleFeature;
