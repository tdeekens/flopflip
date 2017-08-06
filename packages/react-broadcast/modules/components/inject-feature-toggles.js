import { compose } from 'recompose';
import { injectFeatureToggles } from '@flopflip/react';
import withSubscription from './with-subscription';

export default flagNames =>
  compose(
    withSubscription('availableFeatureToggles'),
    injectFeatureToggles(flagNames)
  );
