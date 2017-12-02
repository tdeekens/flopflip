import { compose, withProps, shouldUpdate, shallowEqual } from 'recompose';
import intersection from 'lodash.intersection';
import omit from 'lodash.omit';
import { omitProps } from '../../hocs';
import { ALL_FLAGS_PROP_KEY, DEFAULT_FLAGS_PROP_KEY } from '../../constants';

const filterFeatureToggles = (allFlags, demandedFlags) =>
  intersection(Object.keys(allFlags), demandedFlags).reduce(
    (featureToggles, featureToggle) => ({
      ...featureToggles,
      [featureToggle]: allFlags[featureToggle],
    }),
    {}
  );

export const areOwnPropsEqual = (nextOwnProps, ownProps, propKey) => {
  const featureFlagProps = ownProps[propKey];
  const remainingProps = omit(ownProps, [propKey]);
  const nextFeatureFlagProps = nextOwnProps[propKey];
  const nextRemainingProps = omit(nextOwnProps, [propKey]);

  return (
    shallowEqual(featureFlagProps, nextFeatureFlagProps) &&
    shallowEqual(remainingProps, nextRemainingProps)
  );
};

const injectFeatureToggles = (
  flagNames,
  propKey = DEFAULT_FLAGS_PROP_KEY,
  areOwnPropsEqual = areOwnPropsEqual
) =>
  compose(
    withProps(props => ({
      [propKey]: filterFeatureToggles(props[ALL_FLAGS_PROP_KEY], flagNames),
    })),
    omitProps(ALL_FLAGS_PROP_KEY),
    shouldUpdate(
      (props, nextProps) =>
        typeof areOwnPropsEqual === 'function'
          ? !areOwnPropsEqual(props, nextProps, propKey)
          : true
    )
  );

export default injectFeatureToggles;
