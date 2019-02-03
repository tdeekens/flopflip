import { FlagName, FlagVariation } from '@flopflip/types';

import React from 'react';
import flowRight from 'lodash.flowright';
import { withProps } from '../../hocs';
import isNil from 'lodash.isnil';
import { omitProps } from '../../hocs';
import { DEFAULT_FLAG_PROP_KEY, ALL_FLAGS_PROP_KEY } from '../../constants';

type RequiredProps = {};
type ProvidedProps = {};

type Diff<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

const injectFeatureToggle = (
  flagName: FlagName,
  propKey: string = DEFAULT_FLAG_PROP_KEY
): React.ComponentType<Diff<RequiredProps, ProvidedProps>> =>
  flowRight(
    withProps((ownProps: RequiredProps) => {
      const flagVariation: FlagVariation =
        ownProps[ALL_FLAGS_PROP_KEY][flagName];

      return { [propKey]: isNil(flagVariation) ? false : flagVariation };
    }),
    omitProps(ALL_FLAGS_PROP_KEY)
  );

export default injectFeatureToggle;
