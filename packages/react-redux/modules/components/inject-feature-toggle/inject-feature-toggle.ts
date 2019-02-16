import React from 'react';
import { connect } from 'react-redux';
import flowRight from 'lodash/flowRight';
import { FlagName, Flags } from '@flopflip/types';
import { State } from '../../types';
import { selectFlags } from '../../ducks';
import {
  injectFeatureToggle,
  wrapDisplayName,
  setDisplayName,
  ALL_FLAGS_PROP_KEY,
} from '@flopflip/react';

type StateToProps = {
  '@flopflip/flags': Flags;
};

export const mapStateToProps = (state: State): StateToProps => ({
  [ALL_FLAGS_PROP_KEY]: selectFlags(state),
});

type Props = {
  [propKey: string]: boolean;
};

export default (flagName: FlagName, propKey?: string) => (
  Component: React.ComponentType
): React.ComponentType<Props> =>
  flowRight(
    setDisplayName(wrapDisplayName(Component, 'injectFeatureToggle')),
    // @ts-ignore
    connect(mapStateToProps),
    injectFeatureToggle(flagName, propKey)
  )(Component);
