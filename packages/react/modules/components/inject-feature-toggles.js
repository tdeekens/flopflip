import { compose, withProps } from 'recompose';
import intersection from 'lodash.intersection';
import omitProps from '@hocs/omit-props';
import { ALL_FLAGS } from '../constants';

const filterFeatureToggles = (allFlags, flagNames) =>
  intersection(Object.keys(allFlags), flagNames).reduce(
    (featureToggles, featureToggle) => ({
      [featureToggle]: allFlags[featureToggle],
    }),
    {}
  );

const injectFeatureToggles = flagNames =>
  compose(
    withProps(props => ({
      featureToggles: filterFeatureToggles(props[ALL_FLAGS], flagNames),
    })),
    omitProps(ALL_FLAGS)
  );

export default injectFeatureToggles;
