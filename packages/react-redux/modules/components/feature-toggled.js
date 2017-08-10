import { connect } from 'react-redux';
import isNil from 'lodash.isnil';
import { FeatureToggled } from '@flopflip/react';
import { STATE_SLICE } from './../store';

export const mapStateToProps = (state, ownProps) => {
  const flagValue = state[STATE_SLICE].flags[ownProps.flag];

  return { isFeatureEnabled: isNil(flagValue) ? false : flagValue };
};

export default connect(mapStateToProps)(FeatureToggled);
