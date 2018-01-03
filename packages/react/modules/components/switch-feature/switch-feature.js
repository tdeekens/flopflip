// @flow

import type {
  FlagName,
  FlagVariation,
  Flags,
  Adapter,
  AdapterArgs,
} from '@flopflip/types';

import * as React from 'react';

type Props = {
  children: React.Node,
};

const isEmptyChildren = (children: React.Node): boolean =>
  React.Children.count(children) === 0;

export default class SwitchFeature extends React.PureComponent<Props> {
  render(): React.Node {
    let variate: ?FlagVariation;
    let child: ?React.Element<any>;
    React.Children.forEach(this.props.children, element => {
      if (variate == null && React.isValidElement(element)) {
        child = element;
        variate = element.props.isFeatureEnabled ? element.props.variate : null;
      }
    });

    return variate && child ? React.cloneElement(child, { variate }) : null;
  }
}
