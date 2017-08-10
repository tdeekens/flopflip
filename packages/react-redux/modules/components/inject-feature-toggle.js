import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectFeatureToggle } from '@flopflip/react';
import { STATE_SLICE } from './../store';

export const mapStateToProps = state => ({
  availableFeatureToggles: state[STATE_SLICE].flags,
});

/* istanbul ignore next */
export default (flagName, propKey) =>
  compose(connect(mapStateToProps), injectFeatureToggle(flagName, propKey));
