import { FlagName, FlagVariation } from '@flopflip/types';

import React from 'react';
import { ToggleFeature as SharedToggleFeature } from '@flopflip/react';
import { useFeatureToggle } from '../../hooks/';

type Props = {
  flag: FlagName;
  variation: FlagVariation;
};

const ToggleFeature = <OwnProps extends Props>(props: OwnProps) => {
  const isFeatureEnabled = useFeatureToggle(props.flag, props.variation);

  return <SharedToggleFeature {...props} isFeatureEnabled={isFeatureEnabled} />;
};

ToggleFeature.displayName = 'ToggleFeature';

export default ToggleFeature;
