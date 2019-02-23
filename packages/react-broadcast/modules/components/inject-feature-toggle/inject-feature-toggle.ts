import React from 'react';
import flowRight from 'lodash/flowRight';
import {
  injectFeatureToggle,
  wrapDisplayName,
  setDisplayName,
} from '@flopflip/react';
import { FlagName, FlagVariation } from '@flopflip/types';
import { withFlags } from '../configure';

type InjectedProps = {
  [propKey: string]: FlagVariation;
};

export default <Props extends object>(flagName: FlagName, propKey?: string) => (
  Component: React.ComponentType<Props>
): React.ComponentType<Props & InjectedProps> =>
  flowRight(
    setDisplayName(wrapDisplayName(Component, 'injectFeatureToggle')),
    withFlags<Props>(),
    // @ts-ignore
    injectFeatureToggle<Props>(flagName, propKey)
  )(Component);
