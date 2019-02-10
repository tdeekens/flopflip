import React from 'react';
import flowRight from 'lodash/flowRight';
import {
  injectFeatureToggle,
  wrapDisplayName,
  setDisplayName,
} from '@flopflip/react';
import { FlagName, Flags } from '@flopflip/types';
import { withFlags } from '../configure';

export default <Props extends object>(flagName: FlagName, propKey?: string) => (
  Component: React.ComponentType<Props>
): React.ComponentType<Props & Flags> =>
  flowRight(
    setDisplayName(wrapDisplayName(Component, 'injectFeatureToggle')),
    withFlags(),
    // @ts-ignore
    injectFeatureToggle(flagName, propKey)
    // @ts-ignore
  )(Component);
