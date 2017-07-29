import { compose } from 'recompose';
import { injectFeatureToggles } from '@flopflip/react';
import withSubscription from './with-subscription';

export default requestedFeatureToggles =>
  compose(
    withSubscription('availableFeatureToggles'),
    injectFeatureToggles(requestedFeatureToggles)
  );
