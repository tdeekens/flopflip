import { DeepReadonly } from 'ts-essentials';
import React from 'react';
import { TUser } from '@flopflip/types';
import AdapterContext from '../adapter-context';

type Props = DeepReadonly<{
  shouldOverwrite?: boolean;
  user: TUser;
  children?: React.ReactNode;
}>;

const ReconfigureAdapter = (props: Props) => {
  const adapterContext = React.useContext(AdapterContext);

  React.useEffect(() => {
    adapterContext.reconfigure(
      {
        user: props.user,
      },
      {
        shouldOverwrite: props.shouldOverwrite,
      }
    );
  }, [props.user, props.shouldOverwrite, adapterContext]);

  return props.children ? React.Children.only(props.children) : null;
};

ReconfigureAdapter.displayName = 'ReconfigureAdapter';
ReconfigureAdapter.defaultProps = {
  shouldOverwrite: false,
  children: null,
};

export default ReconfigureAdapter;
