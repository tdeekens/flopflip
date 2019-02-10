import React from 'react';
import flowRight from 'lodash/flowRight';
import {
  branchOnFeatureToggle,
  wrapDisplayName,
  setDisplayName,
  DEFAULT_FLAG_PROP_KEY,
} from '@flopflip/react';
import { FlagName, FlagVariation } from '@flopflip/types';
import injectFeatureToggle from './../inject-feature-toggle';

export default <Props extends object>(
  { flag, variation }: { flag: FlagName; variation: FlagVariation },
  UntoggledComponent: React.ComponentType<Props>
) => (Component: React.ComponentType<Props>) =>
  flowRight(
    setDisplayName(wrapDisplayName(Component, 'branchOnFeatureToggle')),
    injectFeatureToggle(flag),
    branchOnFeatureToggle(UntoggledComponent, DEFAULT_FLAG_PROP_KEY, variation)
  )(Component);
