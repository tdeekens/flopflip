import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { injectFeatureToggle, ALL_FLAGS_PROP_KEY } from '@flopflip/react';
import withFlagSubscription from '../with-flag-subscription/';

export default (flagName, propKey) => WrappedComponent =>
  compose(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggle')),
    withFlagSubscription(ALL_FLAGS_PROP_KEY),
    injectFeatureToggle(flagName, propKey)
  )(WrappedComponent);
