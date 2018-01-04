// @flow

import type { FlagName, FlagVariation } from '@flopflip/types';

import React, { PureComponent, type ComponentType, type Node } from 'react';
import { wrapDisplayName } from 'recompose';
import { Subscriber } from 'react-broadcast';
import { FLAGS_CHANNEL } from '../../constants';

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
        <Subscriber channel={FLAGS_CHANNEL}>
          {data => (
            <WrappedComponent {...{ [propKey]: data }} {...this.props} />
          )}
        </Subscriber>
      );
    }
  }

  return WithFlagSubscription;
};

export default withFlagSubscription;
