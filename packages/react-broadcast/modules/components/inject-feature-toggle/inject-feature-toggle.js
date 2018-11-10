// @flow

import type { FlagName } from '@flopflip/types';

import React, { type ComponentType } from 'react';
import { compose } from 'recompose';
import { injectFeatureToggle, wrapDisplayName } from '@flopflip/react';
import { withFlags } from '../configure';

type RequiredProps = {};
type ProvidedProps = {};

export default <RequiredProps, ProvidedProps>(
  flagName: FlagName,
  propKey?: string
) => (WrappedComponent: ComponentType<$Diff<RequiredProps, ProvidedProps>>) =>
  compose(
    wrapDisplayName('injectFeatureToggle'),
    withFlags(),
    injectFeatureToggle(flagName, propKey)
  )(WrappedComponent);
