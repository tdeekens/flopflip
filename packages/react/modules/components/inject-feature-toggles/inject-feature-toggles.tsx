import { FlagName, Flags, Diff } from '@flopflip/types';

import React from 'react';

import { withProps } from '../../hocs';
import isEqual from 'react-fast-compare';
import flowRight from 'lodash/flowright';
import intersection from 'lodash/intersection';
import omit from 'lodash/omit';
import { omitProps } from '../../hocs';
import { ALL_FLAGS_PROP_KEY, DEFAULT_FLAGS_PROP_KEY } from '../../constants';

type RequiredProps = {};
type ProvidedProps = {};

const filterFeatureToggles = (
  allFlags: Flags,
  demandedFlags: Array<FlagName>
) =>
  intersection(Object.keys(allFlags), demandedFlags).reduce(
    (featureToggles: Flags, featureToggle: FlagName) => ({
      ...featureToggles,
      [featureToggle]: allFlags[featureToggle],
    }),
    {}
  );

const defaultAreOwnPropsEqual = (
  nextOwnProps: ProvidedProps,
  ownProps: ProvidedProps,
  propKey: string
): boolean => {
  const featureFlagProps: Flags = ownProps[propKey];
  const remainingProps: Diff<ProvidedProps, Flags> = omit(ownProps, [propKey]);
  const nextFeatureFlagProps: Flags = nextOwnProps[propKey];
  const nextRemainingProps: Diff<ProvidedProps, Flags> = omit(nextOwnProps, [
    propKey,
  ]);

  return (
    isEqual(featureFlagProps, nextFeatureFlagProps) &&
    isEqual(remainingProps, nextRemainingProps)
  );
};
export { defaultAreOwnPropsEqual as areOwnPropsEqual };

const injectFeatureToggles = (
  flagNames: Array<FlagName>,
  propKey: string = DEFAULT_FLAGS_PROP_KEY,
  areOwnPropsEqual: (
    nextOwnProps: ProvidedProps,
    ownProps: ProvidedProps,
    propKey: string
  ) => boolean = defaultAreOwnPropsEqual
): React.ComponentType<Diff<RequiredProps, ProvidedProps>> =>
  flowRight(
    withProps((props: RequiredProps) => ({
      [propKey]: filterFeatureToggles(props[ALL_FLAGS_PROP_KEY], flagNames),
    })),
    omitProps(ALL_FLAGS_PROP_KEY),
    (BaseComponent: React.ComponentType<ProvidedProps>) =>
      class ShouldUpdate extends React.Component<{}> {
        static displayName = BaseComponent.displayName;

        shouldComponentUpdate(nextProps: ProvidedProps) {
          return typeof areOwnPropsEqual === 'function'
            ? !areOwnPropsEqual(this.props, nextProps, propKey)
            : true;
        }

        render(): React.ReactNode {
          return <BaseComponent {...this.props} />;
        }
      }
  );

export default injectFeatureToggles;
