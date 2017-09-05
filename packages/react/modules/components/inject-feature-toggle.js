import { withProps } from 'recompose';
import isNil from 'lodash.isnil';
import { defaultFlagName } from '../helpers/is-feature-enabled';

const injectFeatureToggle = (flagName, propKey = defaultFlagName) =>
  withProps(props => {
    const flagValue = props.availableFeatureToggles[flagName];

    return { [propKey]: isNil(flagValue) ? false : flagValue };
  });

export default injectFeatureToggle;
