import { connect } from 'react-redux';
import { compose } from 'recompose';
import { injectFeatureToggles } from '@flopflip/react';
import { STATE_SLICE } from './../store';

export const mapStateToProps = state => ({
  availableFeatureToggles: state[STATE_SLICE].flags,
});

export default flagNames =>
  compose(connect(mapStateToProps), injectFeatureToggles(flagNames));
