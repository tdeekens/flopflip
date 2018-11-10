// @flow

import type { FlagName, FlagVariation } from '@flopflip/types';

import React, { type ComponentType } from 'react';
import flowRight from 'lodash.flowright';
import {
  branchOnFeatureToggle,
  wrapDisplayName,
  DEFAULT_FLAG_PROP_KEY,
} from '@flopflip/react';
import injectFeatureToggle from './../inject-feature-toggle';

type RequiredProps = {};
type ProvidedProps = {};

export default <RequiredProps, ProvidedProps>(
  { flag, variation }: { flag: FlagName, variation: FlagVariation },
  UntoggledComponent: ComponentType<any>
) => (WrappedComponent: ComponentType<$Diff<RequiredProps, ProvidedProps>>) =>
  flowRight(
    wrapDisplayName('branchOnFeatureToggle'),
    injectFeatureToggle(flag),
    branchOnFeatureToggle(UntoggledComponent, DEFAULT_FLAG_PROP_KEY, variation)
  )(WrappedComponent);
