import { FlagName } from '@flopflip/types';

import React from 'react';
import flowRight from 'lodash.flowright';
import {
  injectFeatureToggle,
  wrapDisplayName,
  setDisplayName,
} from '@flopflip/react';
import { withFlags } from '../configure';

type RequiredProps = {};
type ProvidedProps = {};
type Diff<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

export default <P extends RequiredProps>(
  flagName: FlagName,
  propKey?: string
) => (WrappedComponent: React.ComponentType<Diff<RequiredProps, ProvidedProps>>): React.ComponentType<ProvidedProps & P> =>
  flowRight(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggle')),
    withFlags(),
    injectFeatureToggle(flagName, propKey)
  )(WrappedComponent);
