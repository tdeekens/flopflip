import React from 'react';
import { User } from '@flopflip/types';
import AdapterContext from '../adapter-context';

type Props = {
  shouldOverwrite?: boolean;
  user: User;
  children?: React.Component<any>;
};

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
