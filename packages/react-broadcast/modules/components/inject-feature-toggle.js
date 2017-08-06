import { compose } from 'recompose';
import { injectFeatureToggle } from '@flopflip/react';
import withSubscription from './with-subscription';

export default (flagName, propKey) =>
  compose(
    withSubscription('availableFeatureToggles'),
    injectFeatureToggle(flagName, propKey)
  );
