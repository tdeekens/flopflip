// @flow

import type { FlagName } from '@flopflip/types';

import React, { type ComponentType } from 'react';
import { connect } from 'react-redux';
import flowRight from 'lodash.flowright';
import { selectFlags } from '../../ducks';
import {
  injectFeatureToggle,
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

export default (flagName: FlagName, propKey?: string) => (
  WrappedComponent: ComponentType<$Diff<RequiredProps, ProvidedProps>>
) =>
  /* istanbul ignore next */
  flowRight(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggle')),
    connect(mapStateToProps),
    injectFeatureToggle(flagName, propKey)
  )(WrappedComponent);
