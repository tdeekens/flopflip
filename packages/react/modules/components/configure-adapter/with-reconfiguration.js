// @flow

import type { Adapter } from '@flopflip/types';

import React, { PureComponent, type ComponentType, type Node } from 'react';
import { wrapDisplayName } from '../../hocs/wrap-display-name';
import { AdapterContext } from './configure-adapter';

type RequiredProps = {};
type ProvidedProps = {};

const withReconfiguration = (propKey: string = 'reconfigure') => (
  Component: ComponentType<RequiredProps>
) => {
  class EnhancedComponent extends PureComponent<
    $Diff<RequiredProps, ProvidedProps>
  > {
    static displayName = wrapDisplayName('withReconfiguration', Component);
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
