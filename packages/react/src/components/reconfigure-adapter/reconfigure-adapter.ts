import type { TUser } from '@flopflip/types';

import { useEffect, Children } from 'react';
import useAdapterContext from '../../hooks/use-adapter-context';

type Props = {
  shouldOverwrite?: boolean;
  user: TUser;
  children?: React.ReactNode;
};

const ReconfigureAdapter = (props: Props) => {
  const adapterContext = useAdapterContext();

  useEffect(() => {
    adapterContext.reconfigure(
      {
        user: props.user,
      },
      {
        shouldOverwrite: props.shouldOverwrite,
      }
    );
  }, [props.user, props.shouldOverwrite, adapterContext]);

  return props.children ? Children.only(props.children) : null;
};

ReconfigureAdapter.displayName = 'ReconfigureAdapter';
ReconfigureAdapter.defaultProps = {
  shouldOverwrite: false,
  children: null,
};

export default ReconfigureAdapter;
