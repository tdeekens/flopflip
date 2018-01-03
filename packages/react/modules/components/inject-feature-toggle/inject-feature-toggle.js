// @flow

import type { FlagName, FlagValue } from '@flopflip/types';

import * as React from 'react';
import { compose, withProps } from 'recompose';
import isNil from 'lodash.isnil';
import { omitProps } from '../../hocs';
import { DEFAULT_FLAG_PROP_KEY, ALL_FLAGS_PROP_KEY } from '../../constants';

type RequiredProps = {};
type ProvidedProps = {};

const injectFeatureToggle = (
  flagName: FlagName,
  propKey: string = DEFAULT_FLAG_PROP_KEY
): React.ComponentType<$Diff<RequiredProps, ProvidedProps>> =>
  compose(
    withProps((props: RequiredProps) => {
      const flagValue: FlagValue = props[ALL_FLAGS_PROP_KEY][flagName];

      return { [propKey]: isNil(flagValue) ? false : flagValue };
    }),
    omitProps(ALL_FLAGS_PROP_KEY)
  );

export default injectFeatureToggle;
