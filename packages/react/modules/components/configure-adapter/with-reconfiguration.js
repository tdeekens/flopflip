// @flow

import type { Adapter } from '@flopflip/types';

import React, { PureComponent, type ComponentType, type Node } from 'react';
import { AdapterContext } from '../adapter-context';

type RequiredProps = {};
type ProvidedProps = {};

const withReconfiguration = (propKey: string = 'reconfigure') => (
  Component: ComponentType<RequiredProps>
) => {
  class EnhancedComponent extends PureComponent<
    $Diff<RequiredProps, ProvidedProps>
  > {
    static displayName = `withReconfiguration(${Component.displayName ||
      Component.name})`;
    render(): Node {
      return (
        <AdapterContext.Consumer>
          {reconfigure => (
            <Component {...this.props} {...{ [propKey]: reconfigure }} />
          )}
        </AdapterContext.Consumer>
      );
    }
  }

  return EnhancedComponent;
};

export default withReconfiguration;
