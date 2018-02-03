// @flow

import type { FlagName, FlagVariation } from '@flopflip/types';

import React, { PureComponent, type ComponentType, type Node } from 'react';
import { wrapDisplayName } from 'recompose';
import { FlagsContext } from '../configure';

type RequiredProps = {};
type ProvidedProps = {};

const withFlagSubscription = (propKey: string) => (
  WrappedComponent: ComponentType<RequiredProps>
) => {
  class WithFlagSubscription extends PureComponent<
    $Diff<RequiredProps, ProvidedProps>
  > {
    static displayName = wrapDisplayName(
      WrappedComponent,
      'withFlagSubscription'
    );
    render(): Node {
      return (
        <FlagsContext.Consumer>
          {flags => (
            <WrappedComponent {...{ [propKey]: flags }} {...this.props} />
          )}
        </FlagsContext.Consumer>
      );
    }
  }

  return WithFlagSubscription;
};

export default withFlagSubscription;
