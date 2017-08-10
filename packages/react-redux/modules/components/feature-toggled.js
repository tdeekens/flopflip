import { connect } from 'react-redux';
import { FeatureToggled } from '@flopflip/react';
import { STATE_SLICE } from './../store';

export const mapStateToProps = (state, ownProps) => ({
  isFeatureEnabled: Boolean(state[STATE_SLICE].flags[ownProps.flag]),
});

export default connect(mapStateToProps)(FeatureToggled);
