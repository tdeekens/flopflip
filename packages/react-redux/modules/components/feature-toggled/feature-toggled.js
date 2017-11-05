import { connect } from 'react-redux';
import { FeatureToggled, isFeatureEnabled } from '@flopflip/react';
import { STATE_SLICE } from './../../store';

export const mapStateToProps = (state, ownProps) => ({
  isFeatureEnabled: isFeatureEnabled(ownProps.flag, ownProps.variate)(
    state[STATE_SLICE].flags
  ),
});

/* istanbul ignore next */
export default connect(mapStateToProps)(FeatureToggled);
