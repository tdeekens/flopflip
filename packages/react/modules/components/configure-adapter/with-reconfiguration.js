// @flow

import type { Adapter } from '@flopflip/types';

import React, { PureComponent, type ComponentType, type Node } from 'react';
import { wrapDisplayName } from 'recompose';
import { AdapterContext } from './configure-adapter';

type RequiredProps = {};
type ProvidedProps = {};

const withReconfiguration = (propKey: string = 'reconfigure') => (
  Component: ComponentType<RequiredProps>
) => {
  class EnhancedComponent extends PureComponent<
    $Diff<RequiredProps, ProvidedProps>
  > {
    static displayName = wrapDisplayName(Component, 'withReconfiguration');
    render(): Node {
      return (
        <AdapterContext.Consumer>
          {reconfigure => (
            <Component {...{ [propKey]: reconfigure }} {...this.props} />
          )}
        </AdapterContext.Consumer>
      );
    }
  }

  return EnhancedComponent;
};

export default withReconfiguration;
