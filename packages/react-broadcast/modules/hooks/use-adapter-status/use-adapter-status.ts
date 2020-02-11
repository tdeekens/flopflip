import React from 'react';
import { AdapterContext } from '@flopflip/react';
import { TAdapterContext } from '@flopflip/types';

export default function useAdapterStatus() {
  const adapterContext: TAdapterContext = React.useContext(AdapterContext);

  React.useDebugValue(adapterContext.status);

  return adapterContext.status;
}
