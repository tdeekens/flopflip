// @flow

import type { FlagName, FlagVariation, Flags, State } from '../../types.js';

import { compose, setDisplayName } from 'recompose';
import { connect } from 'react-redux';
import { ToggleFeature, isFeatureEnabled } from '@flopflip/react';
import { STATE_SLICE } from './../../store';

type OwnProps = {
  [FlagName]: FlagVariation,
};

export const mapStateToProps = (state: State, ownProps: OwnProps) => ({
  isFeatureEnabled: isFeatureEnabled(ownProps.flag, ownProps.variation)(
    state[STATE_SLICE].flags
  ),
});

/* istanbul ignore next */
export default compose(
  setDisplayName(ToggleFeature.displayName),
  connect(mapStateToProps)
)(ToggleFeature);
