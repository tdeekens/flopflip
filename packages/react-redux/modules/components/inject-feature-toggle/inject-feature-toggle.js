// @flow

import type { FlagName } from '../../types.js';

import * as React from 'react';
import { connect } from 'react-redux';
import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { selectFlags } from '../../ducks';
import { injectFeatureToggle, ALL_FLAGS_PROP_KEY } from '@flopflip/react';
import { STATE_SLICE } from './../../store';

type RequiredProps = {};
type ProvidedProps = {};

export const mapStateToProps = (state: mixed) => ({
  [ALL_FLAGS_PROP_KEY]: selectFlags(state),
});

export default (flagName: FlagName, propKey?: string) => (
  WrappedComponent: React.ComponentType<$Diff<RequiredProps, ProvidedProps>>
) =>
  /* istanbul ignore next */
  compose(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggle')),
    connect(mapStateToProps),
    injectFeatureToggle(flagName, propKey)
  )(WrappedComponent);
