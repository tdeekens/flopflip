// @flow

import type { FlagName, FlagVariation } from '@flopflip/types';

import React, { PureComponent, type ComponentType, type Node } from 'react';
import { wrapDisplayName } from 'recompose';
import { FlagsContext } from '../configure';

type RequiredProps = {};
type ProvidedProps = {};

const withFlags = (propKey: string) => (
  Component: ComponentType<RequiredProps>
) => {
  class EnhancedComponent extends PureComponent<
    $Diff<RequiredProps, ProvidedProps>
  > {
    static displayName = wrapDisplayName(Component, 'withFlags');
    render(): Node {
      return (
        <FlagsContext.Consumer>
          {flags => <Component {...{ [propKey]: flags }} {...this.props} />}
        </FlagsContext.Consumer>
      );
    }
  }

  return EnhancedComponent;
};

export default withFlags;
