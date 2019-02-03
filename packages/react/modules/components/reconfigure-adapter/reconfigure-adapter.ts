import {
  User,
  AdapterArgs,
  AdapterReconfigurationOptions,
} from '@flopflip/types';

import React from 'react';
import PropTypes from 'prop-types';

import { withReconfiguration } from '../configure-adapter';

type Props = {
  shouldOverwrite?: boolean;
  user: User;
  reconfigure: (
    adapterArgs: Partial<AdapterArgs>,
    options?: AdapterReconfigurationOptions
  ) => void;
  children?: React.Component<any>;
};

export class ReconfigureAdapter extends React.PureComponent<Props> {
  static displayName = 'ReconfigureAdapter';

  static defaultProps = {
    shouldOverwrite: false,
    children: null,
  };

  static propTypes = {
    shouldOverwrite: PropTypes.bool,
    children: PropTypes.node,
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

  render() {
    return this.props.children
      ? React.Children.only(this.props.children)
      : null;
  }
}

export default withReconfiguration()(ReconfigureAdapter);
