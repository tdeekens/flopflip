import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { injectFeatureToggle, ALL_FLAGS } from '@flopflip/react';
import withSubscription from './with-subscription';

export default (flagName, propKey) => EnhancedComponent =>
  compose(
    withSubscription(ALL_FLAGS),
    injectFeatureToggle(flagName, propKey),
    setDisplayName(wrapDisplayName(EnhancedComponent, 'InjectFeatureToggle'))
  )(EnhancedComponent);
