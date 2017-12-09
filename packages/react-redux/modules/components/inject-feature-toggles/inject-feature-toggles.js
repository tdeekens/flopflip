import { connect } from 'react-redux';
import { compose, setDisplayName, wrapDisplayName } from 'recompose';
import { selectFlags } from '../../ducks';
import { injectFeatureToggles, ALL_FLAGS_PROP_KEY } from '@flopflip/react';
import { STATE_SLICE } from './../../store';

export const mapStateToProps = state => ({
  [ALL_FLAGS_PROP_KEY]: selectFlags(state),
});

export default (flagNames, propKey) => WrappedComponent =>
  /* istanbul ignore next */
  compose(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggles')),
    injectFeatureToggles(flagNames, propKey),
    connect(mapStateToProps)
  )(WrappedComponent);
