import { compose, withProps } from 'recompose';
import intersect from 'just-intersect';
import omitProps from '@hocs/omit-props';
import { ALL_FLAGS, DEFAULT_FLAGS_PROP_KEY } from '../constants';

const filterFeatureToggles = (allFlags, demandedFlags) =>
  intersect(Object.keys(allFlags), demandedFlags).reduce(
    (featureToggles, featureToggle) => ({
      ...featureToggles,
      [featureToggle]: allFlags[featureToggle],
    }),
    {}
  );

const injectFeatureToggles = (flagNames, propKey = DEFAULT_FLAGS_PROP_KEY) =>
  compose(
    withProps(props => ({
      [propKey]: filterFeatureToggles(props[ALL_FLAGS], flagNames),
    })),
    omitProps(ALL_FLAGS)
  );

export default injectFeatureToggles;
