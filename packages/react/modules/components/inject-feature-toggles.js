import { withProps } from 'recompose';
import intersection from 'lodash.intersection';

const filterFeatureToggles = (availableFeatureToggles, flagNames) =>
  intersection(Object.keys(availableFeatureToggles), flagNames).reduce(
    (featureToggles, featureToggle) => ({
      [featureToggle]: availableFeatureToggles[featureToggle],
    }),
    {}
  );

const injectFeatureToggles = flagNames =>
  withProps(props => ({
    featureToggles: filterFeatureToggles(
      props.availableFeatureToggles,
      flagNames
    ),
  }));

export default injectFeatureToggles;
