// @flow

import type { FlagName, FlagVariation } from '@flopflip/types';

import React, { type ComponentType } from 'react';
import { branch, renderNothing, renderComponent } from 'recompose';
import isFeatureEnabled from '../../helpers/is-feature-enabled';
import { DEFAULT_FLAG_PROP_KEY } from '../../constants';

const branchOnFeatureToggle = (
  UntoggledComponent: ComponentType<any>,
  flagName: FlagName = DEFAULT_FLAG_PROP_KEY,
  flagVariation: FlagVariation = true
): ComponentType<any> =>
  branch(
    props => !isFeatureEnabled(flagName, flagVariation)(props),
    UntoggledComponent ? renderComponent(UntoggledComponent) : renderNothing
  );

export default branchOnFeatureToggle;
