import { connect } from 'react-redux';
import { compose, withProps } from 'recompose';
import intersection from 'lodash.intersection';
import { STATE_SLICE } from './../store';

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

export const injectFeatureToggles = requestedFeatureToggles =>
  withProps(props => ({
    featureToggles: filterFeatureToggles(
      props.availableFeatureToggles,
      requestedFeatureToggles
    ),
  }));

export default requestedFeatureToggles =>
  compose(
    connect(state => ({
      availableFeatureToggles: state[STATE_SLICE].flags,
    })),
    injectFeatureToggles(requestedFeatureToggles)
  );
