import { FlagName } from '@flopflip/types';

import React from 'react';
import flowRight from 'lodash/flowRight';
import {
  injectFeatureToggles,
  wrapDisplayName,
  setDisplayName,
} from '@flopflip/react';
import { withFlags } from '../configure';

export default <Props extends object>(
  flagNames: FlagName[],
  propKey?: string,
  areOwnPropsEqual?: (
    nextOwnProps: Props,
    ownProps: Props,
    propKey: string
  ) => boolean
) => (
  Component: React.ComponentType<Props>
): React.ComponentType<Props> =>
  flowRight(
    setDisplayName(wrapDisplayName(Component, 'injectFeatureToggles')),
    withFlags(),
    // @ts-ignore
    injectFeatureToggles(flagNames, propKey, areOwnPropsEqual)
  )(Component);
