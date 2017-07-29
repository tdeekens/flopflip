import { compose } from 'recompose';
import { branchUntoggled } from '@flopflip/react';
import injectFeatureToggles from './inject-feature-toggles';

export default (featureToggle, UntoggledComponent) =>
  compose(
    injectFeatureToggles([featureToggle]),
    branchUntoggled(UntoggledComponent)
  );
