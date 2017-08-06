import { withProps } from 'recompose';

const injectFeatureToggle = (flagName, propKey = 'isFeatureEnabled') =>
  withProps(props => ({
    [propKey]: Boolean(props.availableFeatureToggles[flagName]),
  }));

export default injectFeatureToggle;
