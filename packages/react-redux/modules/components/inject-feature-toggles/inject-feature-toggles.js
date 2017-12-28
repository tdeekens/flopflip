// @flow

import type { FlagName } from '../../types.js';

import * as React from 'react';
import { connect } from 'react-redux';
import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { selectFlags } from '../../ducks';
import { injectFeatureToggles, ALL_FLAGS_PROP_KEY } from '@flopflip/react';
import { STATE_SLICE } from './../../store';

type RequiredProps = {};
type ProvidedProps = {};

export const mapStateToProps = (state: mixed) => ({
  [ALL_FLAGS_PROP_KEY]: selectFlags(state),
});

export default (flagNames: Array<FlagName>, propKey?: string) => (
  WrappedComponent: React.ComponentType<$Diff<RequiredProps, ProvidedProps>>
) =>
  /* istanbul ignore next */
  compose(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggles')),
    connect(mapStateToProps),
    injectFeatureToggles(flagNames, propKey)
  )(WrappedComponent);
