// @flow

import type { FlagName } from '@flopflip/types';

import React, { type ComponentType } from 'react';
import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { injectFeatureToggles } from '@flopflip/react';
import { withFlags } from '../configure';

type RequiredProps = {};
type ProvidedProps = {};

export default <RequiredProps, ProvidedProps>(
  flagNames: Array<FlagName>,
  propKey?: string,
  areOwnPropsEqual?: (
    nextOwnProps: ProvidedProps,
    ownProps: ProvidedProps,
    propKey: string
  ) => boolean
) => (WrappedComponent: ComponentType<$Diff<RequiredProps, ProvidedProps>>) =>
  compose(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggles')),
    withFlags(),
    injectFeatureToggles(flagNames, propKey, areOwnPropsEqual)
  )(WrappedComponent);
