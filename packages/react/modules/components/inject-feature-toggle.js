import { withProps } from 'recompose';
import isNil from 'lodash.isnil';

const injectFeatureToggle = (flagName, propKey = 'isFeatureEnabled') =>
  withProps(props => {
    const flagValue = props.availableFeatureToggles[flagName];

    return { [propKey]: isNil(flagValue) ? false : flagValue };
  });

export default injectFeatureToggle;
