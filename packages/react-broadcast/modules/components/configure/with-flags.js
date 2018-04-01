// @flow

import type { FlagName, FlagVariation } from '@flopflip/types';

import React, { PureComponent, type ComponentType, type Node } from 'react';
import { wrapDisplayName } from 'recompose';
import { ALL_FLAGS_PROP_KEY } from '@flopflip/react';
import { FlagsContext } from '../configure';

type RequiredProps = {};
type ProvidedProps = {};

const withFlags = (propKey: string = ALL_FLAGS_PROP_KEY) => (
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
