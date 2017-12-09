import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { branchOnFeatureToggle, DEFAULT_FLAG_PROP_KEY } from '@flopflip/react';
import injectFeatureToggle from './../inject-feature-toggle';

export default ({ flag, variation }, UntoggledComponent) => WrappedComponent =>
  compose(
    setDisplayName(wrapDisplayName(WrappedComponent, 'branchOnFeatureToggle')),
    injectFeatureToggle(flag),
    branchOnFeatureToggle(UntoggledComponent, DEFAULT_FLAG_PROP_KEY, variation)
  )(WrappedComponent);
