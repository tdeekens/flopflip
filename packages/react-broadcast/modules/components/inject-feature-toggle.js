import { compose } from 'recompose';
import { injectFeatureToggle } from '@flopflip/react';
import withSubscription from './with-subscription';

export default flagName =>
  compose(
    withSubscription('availableFeatureToggles'),
    injectFeatureToggle(flagName)
  );
