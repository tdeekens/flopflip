import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { branchOnFeatureToggle, DEFAULT_FLAG_PROP_KEY } from '@flopflip/react';
import injectFeatureToggle from './../inject-feature-toggle';

export default ({ flag, variate }, UntoggledComponent) => WrappedComponent =>
  compose(
    injectFeatureToggle(flag),
    branchOnFeatureToggle(UntoggledComponent, DEFAULT_FLAG_PROP_KEY, variate),
    setDisplayName(wrapDisplayName(WrappedComponent, 'branchOnFeatureToggle'))
  )(WrappedComponent);
