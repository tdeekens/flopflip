import flowRight from 'lodash/flowRight';
import { connect } from 'react-redux';
import { FlagName, FlagVariation } from '@flopflip/types';
import { State } from '../../types';
import {
  ToggleFeature,
  setDisplayName,
  getIsFeatureEnabled,
} from '@flopflip/react';
import { STATE_SLICE } from './../../store';

type OwnProps = {
  flag: FlagName;
  variation: FlagVariation;
};

export const mapStateToProps = (state: State, ownProps: OwnProps): object => ({
  isFeatureEnabled: getIsFeatureEnabled(ownProps.flag, ownProps.variation)(
    state[STATE_SLICE].flags
  ),
});

export default flowRight(
  setDisplayName(ToggleFeature.displayName),
  connect(mapStateToProps)
)(ToggleFeature);
