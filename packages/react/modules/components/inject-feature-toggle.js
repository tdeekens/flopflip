import { compose, withProps } from 'recompose';
import isNil from 'lodash.isnil';
import { defaultFlagName } from '../helpers/is-feature-enabled';
import omitProps from '@hocs/omit-props';

const injectFeatureToggle = (flagName, propKey = defaultFlagName) =>
  compose(
    withProps(props => {
      const flagValue = props.availableFeatureToggles[flagName];

      return { [propKey]: isNil(flagValue) ? false : flagValue };
    }),
    omitProps('availableFeatureToggles')
  );

export default injectFeatureToggle;
