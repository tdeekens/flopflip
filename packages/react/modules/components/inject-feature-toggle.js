import { withProps } from 'recompose';

const injectFeatureToggle = (flagName, propKey = 'isFeatureEnabled') =>
  withProps(props => ({
    [propKey]: props.availableFeatureToggles[flagName],
  }));

export default injectFeatureToggle;
