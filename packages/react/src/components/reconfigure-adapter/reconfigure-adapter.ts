import { type TUser } from '@flopflip/types';
import type React from 'react';
import { Children, useEffect } from 'react';

import useAdapterContext from '../../hooks/use-adapter-context';

type Props<TAdditionalUserProperties> = {
  // eslint-disable-next-line react/boolean-prop-naming
  readonly shouldOverwrite?: boolean;
  readonly user: TUser<TAdditionalUserProperties>;
  readonly children?: React.ReactNode;
};

function ReconfigureAdapter<TAdditionalUserProperties>({
  shouldOverwrite = false,
  user,
  children = null,
}: Props<TAdditionalUserProperties>) {
  const adapterContext = useAdapterContext();

  useEffect(() => {
    adapterContext.reconfigure(
      {
        user,
      },
      {
        shouldOverwrite,
      }
    );
  }, [user, shouldOverwrite, adapterContext]);

  return children ? Children.only(children) : null;
}

ReconfigureAdapter.displayName = 'ReconfigureAdapter';

export default ReconfigureAdapter;
