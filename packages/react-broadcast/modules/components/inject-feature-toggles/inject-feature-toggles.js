import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { injectFeatureToggles, ALL_FLAGS_PROP_KEY } from '@flopflip/react';
import withFlagSubscription from '../with-flag-subscription/';

export default (flagNames, propKey) => WrappedComponent =>
  compose(
    withFlagSubscription(ALL_FLAGS_PROP_KEY),
    injectFeatureToggles(flagNames, propKey),
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggles'))
  )(WrappedComponent);
