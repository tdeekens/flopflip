// @flow

import type { FlagName } from '@flopflip/types';

import React, { type ComponentType } from 'react';
import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { injectFeatureToggle } from '@flopflip/react';
import { withFlags } from '../configure';

type RequiredProps = {};
type ProvidedProps = {};

export default <RequiredProps, ProvidedProps>(
  flagName: FlagName,
  propKey?: string
) => (WrappedComponent: ComponentType<$Diff<RequiredProps, ProvidedProps>>) =>
  compose(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggle')),
    withFlags(),
    injectFeatureToggle(flagName, propKey)
  )(WrappedComponent);
