// @flow

import type { FlagName } from '@flopflip/types';

import * as React from 'react';
import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { injectFeatureToggle, ALL_FLAGS_PROP_KEY } from '@flopflip/react';
import withFlagSubscription from '../with-flag-subscription/';

type RequiredProps = {};
type ProvidedProps = {};

export default <RequiredProps, ProvidedProps>(
  flagName: FlagName,
  propKey?: string
) => (
  WrappedComponent: React.ComponentType<$Diff<RequiredProps, ProvidedProps>>
) =>
  compose(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggle')),
    withFlagSubscription(ALL_FLAGS_PROP_KEY),
    injectFeatureToggle(flagName, propKey)
  )(WrappedComponent);
