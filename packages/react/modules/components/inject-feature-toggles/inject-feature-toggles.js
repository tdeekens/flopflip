// @flow

import type { FlagName, Flags, Flag } from '@flopflip/types';

import React, { type ComponentType } from 'react';

import { compose, withProps, shouldUpdate, shallowEqual } from 'recompose';
import intersection from 'lodash.intersection';
import omit from 'lodash.omit';
import { omitProps } from '../../hocs';
import { ALL_FLAGS_PROP_KEY, DEFAULT_FLAGS_PROP_KEY } from '../../constants';

type RequiredProps = {};
type ProvidedProps = {};

const filterFeatureToggles = (allFlags: Flags, demandedFlags: Flags) =>
  intersection(Object.keys(allFlags), demandedFlags).reduce(
    (featureToggles: Flags, featureToggle: Flag) => ({
      ...featureToggles,
      [featureToggle]: allFlags[featureToggle],
    }),
    {}
  );

export const areOwnPropsEqual = (
  nextOwnProps: ProvidedProps,
  ownProps: ProvidedProps,
  propKey: string
): boolean => {
  const featureFlagProps: Flags = ownProps[propKey];
  const remainingProps: $Diff<ProvidedProps, Flags> = omit(ownProps, [propKey]);
  const nextFeatureFlagProps: Flags = nextOwnProps[propKey];
  const nextRemainingProps: $Diff<ProvidedProps, Flags> = omit(nextOwnProps, [
    propKey,
  ]);

  return (
    shallowEqual(featureFlagProps, nextFeatureFlagProps) &&
    shallowEqual(remainingProps, nextRemainingProps)
  );
};

const injectFeatureToggles = (
  flagNames: Array<FlagName>,
  propKey: string = DEFAULT_FLAGS_PROP_KEY,
  areOwnPropsEqual: (
    nextOwnProps: ProvidedProps,
    ownProps: ProvidedProps,
    propKey: string
  ) => boolean = areOwnPropsEqual
): ComponentType<$Diff<RequiredProps, ProvidedProps>> =>
  compose(
    withProps((props: RequiredProps) => ({
      [propKey]: filterFeatureToggles(props[ALL_FLAGS_PROP_KEY], flagNames),
    })),
    omitProps(ALL_FLAGS_PROP_KEY),
    shouldUpdate(
      (props: ProvidedProps, nextProps: ProvidedProps) =>
        typeof areOwnPropsEqual === 'function'
          ? !areOwnPropsEqual(props, nextProps, propKey)
          : true
    )
  );

export default injectFeatureToggles;
