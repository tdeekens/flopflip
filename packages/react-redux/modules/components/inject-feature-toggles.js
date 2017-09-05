import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectFeatureToggles, ALL_FLAGS } from '@flopflip/react';
import { STATE_SLICE } from './../store';

export const mapStateToProps = state => ({
  [ALL_FLAGS]: state[STATE_SLICE].flags,
});

export default flagNames =>
  /* istanbul ignore next */
  compose(connect(mapStateToProps), injectFeatureToggles(flagNames));
