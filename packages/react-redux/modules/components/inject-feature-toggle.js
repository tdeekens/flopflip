import { connect } from 'react-redux';
import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { injectFeatureToggle, ALL_FLAGS } from '@flopflip/react';
import { STATE_SLICE } from './../store';

export const mapStateToProps = state => ({
  [ALL_FLAGS]: state[STATE_SLICE].flags,
});

export default (flagName, propKey) => WrappedComponent =>
  /* istanbul ignore next */
  compose(
    connect(mapStateToProps),
    injectFeatureToggle(flagName, propKey),
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggle'))
  )(WrappedComponent);
