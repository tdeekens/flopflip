// @flow

import type { FlagName, FlagVariation } from '../../types.js';

import * as React from 'react';
import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { branchOnFeatureToggle, DEFAULT_FLAG_PROP_KEY } from '@flopflip/react';
import injectFeatureToggle from './../inject-feature-toggle';

type RequiredProps = {};
type ProvidedProps = {
  [DEFAULT_FLAG_PROP_KEY]: FlagVariation | void,
};

export default <RequiredProps, ProvidedProps>(
  { flag, variation }: { flag: FlagName, variation: FlagVariation },
  UntoggledComponent: React.ComponentType<any>
) => (
  WrappedComponent: React.ComponentType<$Diff<RequiredProps, ProvidedProps>>
) =>
  compose(
    setDisplayName(wrapDisplayName(WrappedComponent, 'branchOnFeatureToggle')),
    injectFeatureToggle(flag),
    branchOnFeatureToggle(UntoggledComponent, DEFAULT_FLAG_PROP_KEY, variation)
  )(WrappedComponent);
