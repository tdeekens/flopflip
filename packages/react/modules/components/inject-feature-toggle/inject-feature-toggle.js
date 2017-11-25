import { compose, withProps } from 'recompose';
import isNil from 'lodash.isnil';
import { omitProps } from '../../hocs';
import { DEFAULT_FLAG_PROP_KEY, ALL_FLAGS_PROP_KEY } from '../../constants';

const injectFeatureToggle = (flagName, propKey = DEFAULT_FLAG_PROP_KEY) =>
  compose(
    withProps(props => {
      const flagValue = props[ALL_FLAGS_PROP_KEY][flagName];

      return { [propKey]: isNil(flagValue) ? false : flagValue };
    }),
    omitProps(ALL_FLAGS_PROP_KEY)
  );

export default injectFeatureToggle;
