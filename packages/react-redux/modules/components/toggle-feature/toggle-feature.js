import { connect } from 'react-redux';
import { ToggleFeature, isFeatureEnabled } from '@flopflip/react';
import { STATE_SLICE } from './../../store';

export const mapStateToProps = (state, ownProps) => ({
  isFeatureEnabled: isFeatureEnabled(ownProps.flag, ownProps.variation)(
    state[STATE_SLICE].flags
  ),
});

/* istanbul ignore next */
export default connect(mapStateToProps)(ToggleFeature);
