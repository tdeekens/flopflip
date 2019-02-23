import React from 'react';
import flowRight from 'lodash/flowRight';
import {
  injectFeatureToggles,
  wrapDisplayName,
  setDisplayName,
} from '@flopflip/react';
import { FlagName, Flags } from '@flopflip/types';
import { withFlags } from '../configure';

type InjectedProps = {
  [propKey: string]: Flags;
};

export default <Props extends object>(
  flagNames: FlagName[],
  propKey?: string,
  areOwnPropsEqual?: (
    nextOwnProps: Props,
    ownProps: Props,
    propKey: string
  ) => boolean
) => (
  Component: React.ComponentType
): React.ComponentType<Props & InjectedProps> =>
  flowRight(
    setDisplayName(wrapDisplayName(Component, 'injectFeatureToggles')),
    withFlags<Props>(),
    // @ts-ignore
    injectFeatureToggles<Props>(flagNames, propKey, areOwnPropsEqual)
  )(Component);
