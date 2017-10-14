import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { injectFeatureToggles, ALL_FLAGS } from '@flopflip/react';
import withFlagSubscription from './with-flag-subscription';

export default (flagNames, propKey) => EnhancedComponent =>
  compose(
    withFlagSubscription(ALL_FLAGS),
    injectFeatureToggles(flagNames, propKey),
    setDisplayName(wrapDisplayName(EnhancedComponent, 'InjectFeatureToggles'))
  )(EnhancedComponent);
