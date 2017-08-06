import { compose } from 'recompose';
import { branchUntoggled } from '@flopflip/react';
import injectFeatureToggle from './inject-feature-toggle';

export default (flagName, UntoggledComponent) =>
  compose(injectFeatureToggle(flagName), branchUntoggled(UntoggledComponent));
