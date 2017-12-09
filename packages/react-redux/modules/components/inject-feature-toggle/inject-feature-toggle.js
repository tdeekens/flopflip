import { connect } from 'react-redux';
import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { selectFlags } from '../../ducks';
import { injectFeatureToggle, ALL_FLAGS_PROP_KEY } from '@flopflip/react';
import { STATE_SLICE } from './../../store';

export const mapStateToProps = state => ({
  [ALL_FLAGS_PROP_KEY]: selectFlags(state),
});

export default (flagName, propKey) => WrappedComponent =>
  /* istanbul ignore next */
  compose(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggle')),
    injectFeatureToggle(flagName, propKey),
    connect(mapStateToProps)
  )(WrappedComponent);
