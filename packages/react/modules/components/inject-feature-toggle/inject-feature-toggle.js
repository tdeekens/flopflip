// @flow

import type { FlagName, FlagValue } from '@flopflip/types';

import React, { type ComponentType } from 'react';
import flowRight from 'lodash.flowright';
import { withProps } from '../../hocs';
import isNil from 'lodash.isnil';
import { omitProps } from '../../hocs';
import { DEFAULT_FLAG_PROP_KEY, ALL_FLAGS_PROP_KEY } from '../../constants';

type RequiredProps = {};
type ProvidedProps = {};

const injectFeatureToggle = (
  flagName: FlagName,
  propKey: string = DEFAULT_FLAG_PROP_KEY
): ComponentType<$Diff<RequiredProps, ProvidedProps>> =>
  flowRight(
    withProps((ownProps: RequiredProps) => {
      const flagValue: FlagValue = ownProps[ALL_FLAGS_PROP_KEY][flagName];

      return { [propKey]: isNil(flagValue) ? false : flagValue };
    }),
    omitProps(ALL_FLAGS_PROP_KEY)
  );

export default injectFeatureToggle;
