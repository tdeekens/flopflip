// @flow

import type { User, AdapterArgs } from '@flopflip/types';

import React, { PureComponent, type Node } from 'react';

import { withReconfiguration } from '../configure-adapter';

type Props = {
  shouldOverwrite?: boolean,
  user: User,
  reconfigure: (
    adapterArgs: AdapterArgs,
    { shouldOverwrite?: boolean }
  ) => void,
  children: React.Component<any>,
};

export class ReconfigureAdapter extends PureComponent<Props> {
  static displayName = 'ReconfigureAdapter';

  static defaultProps = {
    shouldOverwrite: false,
    children: null,
  };

  componentDidMount(): void {
    return this.props.reconfigure(
      {
        user: this.props.user,
      },
      {
        shouldOverwrite: this.props.shouldOverwrite,
      }
    );
  }

  componentDidUpdate(): void {
    return this.props.reconfigure(
      {
        user: this.props.user,
      },
      {
        shouldOverwrite: this.props.shouldOverwrite,
      }
    );
  }

  render(): Node {
    return this.props.children
      ? React.Children.only(this.props.children)
      : null;
  }
}

export default withReconfiguration()(ReconfigureAdapter);
