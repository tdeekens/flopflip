import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { injectFeatureToggles, ALL_FLAGS } from '@flopflip/react';
import withSubscription from './with-subscription';

export default (flagNames, propKey) => EnhancedComponent =>
  compose(
    withSubscription(ALL_FLAGS),
    injectFeatureToggles(flagNames, propKey),
    setDisplayName(wrapDisplayName(EnhancedComponent, 'InjectFeatureToggles'))
  )(EnhancedComponent);
