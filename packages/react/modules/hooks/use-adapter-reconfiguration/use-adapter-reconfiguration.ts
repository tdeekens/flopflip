import React from 'react';
import { AdapterContext } from '@flopflip/react';
import { TAdapterContext, TReconfigureAdapter } from '@flopflip/types';

export default function useAdapterReconfiguration(): TReconfigureAdapter {
  const adapterContext: TAdapterContext = React.useContext(AdapterContext);

  return adapterContext.reconfigure;
}
