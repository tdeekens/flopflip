import { FlagName, FlagVariation } from '@flopflip/types';

import React from 'react';
import flowRight from 'lodash/flowright';
import {
  branchOnFeatureToggle,
  wrapDisplayName,
  setDisplayName,
  DEFAULT_FLAG_PROP_KEY,
} from '@flopflip/react';
import injectFeatureToggle from './../inject-feature-toggle';

type RequiredProps = {};
type ProvidedProps = {};

export default <Props extends RequiredProps>(
  { flag, variation }: { flag: FlagName; variation: FlagVariation },
  UntoggledComponent: React.ComponentType<RequiredProps>
) => (WrappedComponent: React.ComponentType<Props & ProvidedProps>) =>
  flowRight(
    setDisplayName(wrapDisplayName(WrappedComponent, 'branchOnFeatureToggle')),
    injectFeatureToggle(flag),
    branchOnFeatureToggle(UntoggledComponent, DEFAULT_FLAG_PROP_KEY, variation)
  )(WrappedComponent);
