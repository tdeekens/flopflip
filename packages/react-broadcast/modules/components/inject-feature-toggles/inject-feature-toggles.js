// @flow

import type { FlagName } from '@flopflip/types';

import React, { type ComponentType } from 'react';
import flowRight from 'lodash.flowright';
import {
  injectFeatureToggles,
  wrapDisplayName,
  setDisplayName,
} from '@flopflip/react';
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
  flowRight(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggles')),
    withFlags(),
    injectFeatureToggles(flagNames, propKey, areOwnPropsEqual)
  )(WrappedComponent);
