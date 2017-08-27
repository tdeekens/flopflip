import { compose } from 'recompose';
import { branchUntoggled } from '@flopflip/react';
import injectFeatureToggle from './inject-feature-toggle';

export default ({ flagName, flagVariate }, UntoggledComponent) =>
  compose(injectFeatureToggle(flagName), branchUntoggled(UntoggledComponent));
