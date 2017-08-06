import { withProps } from 'recompose';

const injectFeatureToggle = flagName =>
  withProps(props => ({
    featureToggle: props.availableFeatureToggles[flagName],
  }));

export default injectFeatureToggle;
