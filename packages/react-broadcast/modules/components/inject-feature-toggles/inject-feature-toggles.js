// @flow

import type { FlagName } from '../types.js';

import * as React from 'react';
import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { injectFeatureToggles, ALL_FLAGS_PROP_KEY } from '@flopflip/react';
import withFlagSubscription from '../with-flag-subscription/';

type RequiredProps = {};
type ProvidedProps = {};

export default <RequiredProps, ProvidedProps>(
  flagNames: Array<FlagName>,
  propKey?: string
) => (
  WrappedComponent: React.ComponentType<$Diff<RequiredProps, ProvidedProps>>
) =>
  compose(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggles')),
    withFlagSubscription(ALL_FLAGS_PROP_KEY),
    injectFeatureToggles(flagNames, propKey)
  )(WrappedComponent);
