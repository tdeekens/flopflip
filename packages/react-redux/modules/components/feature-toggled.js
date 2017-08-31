import { connect } from 'react-redux';
import { FeatureToggled, isUntoggled } from '@flopflip/react';
import { STATE_SLICE } from './../store';

export const mapStateToProps = (state, ownProps) => ({
  isFeatureEnabled: !isUntoggled(ownProps.flag, ownProps.variate)(
    state[STATE_SLICE].flags
  ),
});

/* istanbul ignore next */
export default connect(mapStateToProps)(FeatureToggled);
