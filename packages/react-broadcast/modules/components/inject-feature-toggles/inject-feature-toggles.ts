import { FlagName } from '@flopflip/types';

import React from 'react';
import flowRight from 'lodash.flowright';
import {
  injectFeatureToggles,
  wrapDisplayName,
  setDisplayName,
} from '@flopflip/react';
import { withFlags } from '../configure';

type RequiredProps = {};
type ProvidedProps = {};
type Diff<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

export default <P extends RequiredProps>(
  flagNames: Array<FlagName>,
  propKey?: string,
  areOwnPropsEqual?: (
    nextOwnProps: ProvidedProps,
    ownProps: ProvidedProps,
    propKey: string
  ) => boolean
) => (
  WrappedComponent: React.ComponentType<Diff<RequiredProps, ProvidedProps>>
): React.ComponentType<ProvidedProps & P> =>
  flowRight(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggles')),
    withFlags(),
    injectFeatureToggles(flagNames, propKey, areOwnPropsEqual)
  )(WrappedComponent);
