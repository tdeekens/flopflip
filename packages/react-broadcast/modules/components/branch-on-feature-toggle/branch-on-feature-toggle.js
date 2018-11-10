// @flow

import type { FlagName, FlagVariation } from '@flopflip/types';

import React, { type ComponentType } from 'react';
import { compose } from 'recompose';
import {
  branchOnFeatureToggle,
  DEFAULT_FLAG_PROP_KEY,
  wrapDisplayName,
} from '@flopflip/react';
import injectFeatureToggle from './../inject-feature-toggle';

type RequiredProps = {};
type ProvidedProps = {};

export default <RequiredProps, ProvidedProps>(
  { flag, variation }: { flag: FlagName, variation?: FlagVariation },
  UntoggledComponent?: ComponentType<any>
) => (WrappedComponent: ComponentType<$Diff<RequiredProps, ProvidedProps>>) =>
  compose(
    wrapDisplayName('branchOnFeatureToggle'),
    injectFeatureToggle(flag),
    branchOnFeatureToggle(UntoggledComponent, DEFAULT_FLAG_PROP_KEY, variation)
  )(WrappedComponent);
