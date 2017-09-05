import { compose } from 'recompose';
import { injectFeatureToggle, ALL_FLAGS } from '@flopflip/react';
import withSubscription from './with-subscription';

export default (flagName, propKey) =>
  compose(withSubscription(ALL_FLAGS), injectFeatureToggle(flagName, propKey));
