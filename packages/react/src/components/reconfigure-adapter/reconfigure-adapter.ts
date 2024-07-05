import type { TUser } from '@flopflip/types';
// biome-ignore lint/style/useImportType: <explanation>
import React from 'react';
import { Children, useEffect } from 'react';

import useAdapterContext from '../../hooks/use-adapter-context';

type TProps<TAdditionalUserProperties> = {
  readonly shouldOverwrite?: boolean;
  readonly user: TUser<TAdditionalUserProperties>;
  readonly children?: React.ReactNode;
};

function ReconfigureAdapter<TAdditionalUserProperties>({
  shouldOverwrite = false,
  user,
  children = null,
}: TProps<TAdditionalUserProperties>) {
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
