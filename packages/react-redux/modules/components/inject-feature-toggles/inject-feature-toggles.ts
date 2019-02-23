import React from 'react';
import { connect } from 'react-redux';
import flowRight from 'lodash/flowRight';
import { FlagName, Flags } from '@flopflip/types';
import { State } from '../../types';
import { selectFlags } from '../../ducks';
import {
  injectFeatureToggles,
  wrapDisplayName,
  setDisplayName,
  ALL_FLAGS_PROP_KEY,
} from '@flopflip/react';

interface StateToProps {
  '@flopflip/flags': Flags;
}
export const mapStateToProps = (state: State): StateToProps => ({
  [ALL_FLAGS_PROP_KEY]: selectFlags(state),
});

type InjectedProps = {
  [propKey: string]: Flags;
};

export default <Props extends object>(
  flagNames: FlagName[],
  propKey?: string,
  areOwnPropsEqual?: (
    nextOwnProps: Props,
    ownProps: Props,
    propKey: string
  ) => boolean
) => (
  Component: React.ComponentType
): React.ComponentType<Props & InjectedProps> =>
  flowRight(
    setDisplayName(wrapDisplayName(Component, 'injectFeatureToggles')),
    // @ts-ignore
    connect(mapStateToProps),
    injectFeatureToggles<Props>(flagNames, propKey, areOwnPropsEqual)
  )(Component);
