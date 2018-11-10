// @flow

import type { FlagName } from '@flopflip/types';

import React, { type ComponentType } from 'react';
import { compose } from 'recompose';
import { injectFeatureToggles, wrapDisplayName } from '@flopflip/react';
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
    wrapDisplayName('injectFeatureToggles'),
    withFlags(),
    injectFeatureToggles(flagNames, propKey, areOwnPropsEqual)
  )(WrappedComponent);
