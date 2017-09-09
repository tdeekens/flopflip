import { connect } from 'react-redux';
import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { injectFeatureToggles, ALL_FLAGS } from '@flopflip/react';
import { STATE_SLICE } from './../store';

export const mapStateToProps = state => ({
  [ALL_FLAGS]: state[STATE_SLICE].flags,
});

export default (flagNames, propKey) => EnhancedComponent =>
  /* istanbul ignore next */
  compose(
    connect(mapStateToProps),
    injectFeatureToggles(flagNames, propKey),
    setDisplayName(wrapDisplayName(EnhancedComponent, 'InjectFeatureToggles'))
  )(EnhancedComponent);
