// @flow

import { FlagName } from '@flopflip/types';
import { State } from '../../types';

import React from 'react';
import { connect } from 'react-redux';
import flowRight from 'lodash.flowright';
import { selectFlags } from '../../ducks';
import {
  injectFeatureToggle,
  wrapDisplayName,
  setDisplayName,
  ALL_FLAGS_PROP_KEY,
} from '@flopflip/react';

type RequiredProps = {};
type ProvidedProps = {};

export const mapStateToProps = (state: State) => ({
  [ALL_FLAGS_PROP_KEY]: selectFlags(state),
});

export default <P extends RequiredProps>(flagName: FlagName, propKey?: string) => (
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<ProvidedProps & P> =>
  /* istanbul ignore next */
  flowRight(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggle')),
    connect(mapStateToProps),
    injectFeatureToggle(flagName, propKey)
  )(WrappedComponent);
