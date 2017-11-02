import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import isObject from 'lodash.isobject';
import { branchUntoggled, DEFAULT_FLAG_PROP_KEY } from '@flopflip/react';
import injectFeatureToggle from './inject-feature-toggle';

export default ({ flag, variate }, UntoggledComponent) => WrappedComponent =>
  compose(
    injectFeatureToggle(flag),
    branchUntoggled(UntoggledComponent, DEFAULT_FLAG_PROP_KEY, variate),
    setDisplayName(wrapDisplayName(WrappedComponent, 'branchOnFeatureToggle'))
  )(WrappedComponent);
