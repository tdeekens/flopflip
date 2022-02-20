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
<<<<<<< HEAD
||||||| parent of e49d8a66 (refactor: to use vitest over jest)
  // eslint-disable-next-line @typescript-eslint/ban-types
=======
   
>>>>>>> e49d8a66 (refactor: to use vitest over jest)
} & Omit<TToggleFeatureProps, 'isFeatureEnabled'>;

function ToggleFeature<OwnProps extends Props>(props: OwnProps) {
  const isFeatureEnabled = useFeatureToggle(props.flag, props.variation);

  // @ts-expect-error Never returns undefined or null.
  return <SharedToggleFeature {...props} isFeatureEnabled={isFeatureEnabled} />;
}

ToggleFeature.displayName = 'ToggleFeature';

export default ToggleFeature;
