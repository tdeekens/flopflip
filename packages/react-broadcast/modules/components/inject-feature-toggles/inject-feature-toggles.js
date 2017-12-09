import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { injectFeatureToggles, ALL_FLAGS_PROP_KEY } from '@flopflip/react';
import withFlagSubscription from '../with-flag-subscription/';

export default (flagNames, propKey) => WrappedComponent =>
  compose(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggles')),
    withFlagSubscription(ALL_FLAGS_PROP_KEY),
    injectFeatureToggles(flagNames, propKey)
  )(WrappedComponent);
