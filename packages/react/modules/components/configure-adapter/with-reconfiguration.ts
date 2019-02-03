// @flow

import { Adapter } from '@flopflip/types';

import React from 'react';
import { wrapDisplayName } from '../../hocs';
import { AdapterContext } from '../adapter-context';

type RequiredProps = {};
type ProvidedProps = {};

type Diff<T, U> = Pick<T, Exclude<keyof T, keyof U>>;

const withReconfiguration = (propKey: string = 'reconfigure') => (
  Component: React.ComponentType<RequiredProps>
) => {
  class EnhancedComponent extends React.PureComponent<
    Diff<RequiredProps, ProvidedProps>
  > {
    static displayName = wrapDisplayName(Component, 'withReconfiguration');

    render(): React.Node {
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
