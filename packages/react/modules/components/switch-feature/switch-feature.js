// @flow

import type {
  FlagName,
  FlagVariation,
  Flags,
  Adapter,
  AdapterArgs,
} from '@flopflip/types';

import React, { PureComponent, type Node, type Element } from 'react';

type Props = {
  children: Node,
};

const isEmptyChildren = (children: Node): boolean =>
  React.Children.count(children) === 0;

export default class SwitchFeature extends PureComponent<Props> {
  render(): Node {
    let variate: ?FlagVariation;
    let child: ?Element<any>;
    React.Children.forEach(this.props.children, element => {
      if (variate == null && React.isValidElement(element)) {
        child = element;
        variate = element.props.isFeatureEnabled ? element.props.variate : null;
      }
    });

    return variate && child ? React.cloneElement(child, { variate }) : null;
  }
}
