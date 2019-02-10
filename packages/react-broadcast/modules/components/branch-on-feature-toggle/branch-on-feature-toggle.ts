import React from 'react';
import flowRight from 'lodash/flowRight';
import {
  branchOnFeatureToggle,
  DEFAULT_FLAG_PROP_KEY,
  wrapDisplayName,
  setDisplayName,
} from '@flopflip/react';
import { FlagName, FlagVariation } from '@flopflip/types';
import injectFeatureToggle from './../inject-feature-toggle';

export default <Props extends object>(
  { flag, variation }: { flag: FlagName; variation?: FlagVariation },
  UntoggledComponent?: React.ComponentType
) => (ToggledComponent: React.ComponentType): React.ComponentType<Props> =>
  flowRight(
    setDisplayName(wrapDisplayName(ToggledComponent, 'branchOnFeatureToggle')),
    injectFeatureToggle(flag),
    branchOnFeatureToggle(UntoggledComponent, DEFAULT_FLAG_PROP_KEY, variation)
  )(ToggledComponent);
