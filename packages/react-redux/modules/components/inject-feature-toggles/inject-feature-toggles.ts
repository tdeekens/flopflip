import { State } from '../../types';
import { FlagName } from '@flopflip/types';

import React from 'react';
import { connect } from 'react-redux';
import flowRight from 'lodash.flowright';
import { selectFlags } from '../../ducks';
import {
  injectFeatureToggles,
  wrapDisplayName,
  setDisplayName,
  ALL_FLAGS_PROP_KEY,
} from '@flopflip/react';

type RequiredProps = {};
type ProvidedProps = {};

export const mapStateToProps = (state: State) => ({
  [ALL_FLAGS_PROP_KEY]: selectFlags(state),
});

export default (
  flagNames: Array<FlagName>,
  propKey?: string,
  areOwnPropsEqual?: (
    nextOwnProps: ProvidedProps,
    ownProps: ProvidedProps,
    propKey: string
  ) => boolean
) => <P extends RequiredProps>(WrappedComponent: React.ComponentType<P>): React.ComponentType<ProvidedProps & P> =>
  /* istanbul ignore next */
  flowRight(
    setDisplayName(wrapDisplayName(WrappedComponent, 'injectFeatureToggles')),
    connect(mapStateToProps),
    injectFeatureToggles(flagNames, propKey, areOwnPropsEqual)
  )(WrappedComponent);
