import React from 'react';
import flowRight from 'lodash/flowRight';
import {
  injectFeatureToggles,
  wrapDisplayName,
  setDisplayName,
} from '@flopflip/react';
import { FlagName } from '@flopflip/types';
import { withFlags } from '../configure';

type Props = {
  [propKey: string]: boolean;
};

export default (
  flagNames: FlagName[],
  propKey?: string,
  areOwnPropsEqual?: (
    nextOwnProps: Props,
    ownProps: Props,
    propKey: string
  ) => boolean
) => (Component: React.ComponentType): React.ComponentType<Props> =>
  flowRight(
    setDisplayName(wrapDisplayName(Component, 'injectFeatureToggles')),
    withFlags(),
    injectFeatureToggles(flagNames, propKey, areOwnPropsEqual)
  )(Component);
