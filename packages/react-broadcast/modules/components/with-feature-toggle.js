import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import isObject from 'lodash.isobject';
import { branchUntoggled, DEFAULT_FLAG_PROP_KEY } from '@flopflip/react';
import injectFeatureToggle from './inject-feature-toggle';

const safelyExtractFlagAndVariate = options => {
  if (!isObject(options)) {
    // "Legacy" API with just the name as parameter
    console.warn(
      '@flopflip/react-broadcast/with-feature-toggle: Please provide an object `{ flag: String, variate: ?String }`.'
    );
    return { flag: options };
  }

  return options;
};

export default (options, UntoggledComponent) => WrappedComponent => {
  const { flag, variate } = safelyExtractFlagAndVariate(options);
  return compose(
    injectFeatureToggle(flag),
    branchUntoggled(UntoggledComponent, DEFAULT_FLAG_PROP_KEY, variate),
    setDisplayName(wrapDisplayName(WrappedComponent, 'withFeatureToggle'))
  )(WrappedComponent);
};
