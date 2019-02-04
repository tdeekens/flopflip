import { FlagName, FlagVariation, Diff } from '@flopflip/types';

import React from 'react';
import flowRight from 'lodash.flowright';
import {
  branchOnFeatureToggle,
  DEFAULT_FLAG_PROP_KEY,
  wrapDisplayName,
  setDisplayName,
} from '@flopflip/react';
import injectFeatureToggle from './../inject-feature-toggle';

type RequiredProps = {};
type ProvidedProps = {};

export default <Props extends RequiredProps>(
  { flag, variation }: { flag: FlagName; variation?: FlagVariation },
  UntoggledComponent?: React.ComponentType<any>
) => (
  WrappedComponent: React.ComponentType<Diff<RequiredProps, ProvidedProps>>
): React.ComponentType<ProvidedProps & Props> =>
  flowRight(
    setDisplayName(wrapDisplayName(WrappedComponent, 'branchOnFeatureToggle')),
    injectFeatureToggle(flag),
    branchOnFeatureToggle(UntoggledComponent, DEFAULT_FLAG_PROP_KEY, variation)
  )(WrappedComponent);
