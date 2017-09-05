import { compose } from 'recompose';
import isObject from 'lodash.isobject';
import { branchUntoggled, DEFAULT_FLAG_NAME } from '@flopflip/react';
import injectFeatureToggle from './inject-feature-toggle';

const safelyExtractFlagAndVariate = options => {
  if (!isObject(options)) {
    // "Legacy" API with just the name as parameter
    console.warn(
      '@flopflip/react-redux/with-feature-toggle: Please provide an object `{ flag: String, variate: ?String }`.'
    );
    return { flag: options };
  }

  return options;
};

export default (options, UntoggledComponent) => {
  const { flag, variate } = safelyExtractFlagAndVariate(options);
  return compose(
    injectFeatureToggle(flag),
    branchUntoggled(UntoggledComponent, DEFAULT_FLAG_NAME, variate)
  );
};
