import { withProps } from 'recompose';
import intersection from 'lodash.intersection';

const filterFeatureToggles = (
  availableFeatureToggles,
  requestedFeatureToggles
) =>
  intersection(
    Object.keys(availableFeatureToggles),
    requestedFeatureToggles
  ).reduce(
    (featureToggles, featureToggle) => ({
      [featureToggle]: availableFeatureToggles[featureToggle],
    }),
    {}
  );

const injectFeatureToggles = requestedFeatureToggles =>
  withProps(props => ({
    featureToggles: filterFeatureToggles(
      props.availableFeatureToggles,
      requestedFeatureToggles
    ),
  }));

export default injectFeatureToggles;
