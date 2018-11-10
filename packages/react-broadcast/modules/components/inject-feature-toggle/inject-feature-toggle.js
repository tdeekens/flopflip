// @flow

import type { FlagName } from '@flopflip/types';

import React, { type ComponentType } from 'react';
import flowRight from 'lodash.flowright';
import {
  injectFeatureToggle,
  wrapDisplayName,
  setDisplayName,
} from '@flopflip/react';
import { withFlags } from '../configure';

type RequiredProps = {};
type ProvidedProps = {};

export default <RequiredProps, ProvidedProps>(
  flagName: FlagName,
  propKey?: string
) => (WrappedComponent: ComponentType<$Diff<RequiredProps, ProvidedProps>>) =>
  flowRight(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggle')),
    withFlags(),
    injectFeatureToggle(flagName, propKey)
  )(WrappedComponent);
