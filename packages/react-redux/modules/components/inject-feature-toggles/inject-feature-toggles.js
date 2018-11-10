// @flow

import type { FlagName } from '@flopflip/types';

import React, { type ComponentType } from 'react';
import { connect } from 'react-redux';
import flowRight from 'lodash.flowright';
import { selectFlags } from '../../ducks';
import {
  injectFeatureToggles,
  wrapDisplayName,
  setDisplayName,
  ALL_FLAGS_PROP_KEY,
} from '@flopflip/react';
import { STATE_SLICE } from './../../store';

type RequiredProps = {};
type ProvidedProps = {};

export const mapStateToProps = (state: mixed) => ({
  [ALL_FLAGS_PROP_KEY]: selectFlags(state),
});

export default (
  flagNames: Array<FlagName>,
  propKey?: string,
  areOwnPropsEqual?: (
    nextOwnProps: ProvidedProps,
    ownProps: ProvidedProps,
    propKey: string
  ) => boolean
) => (WrappedComponent: ComponentType<$Diff<RequiredProps, ProvidedProps>>) =>
  /* istanbul ignore next */
  flowRight(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggles')),
    connect(mapStateToProps),
    injectFeatureToggles(flagNames, propKey, areOwnPropsEqual)
  )(WrappedComponent);
