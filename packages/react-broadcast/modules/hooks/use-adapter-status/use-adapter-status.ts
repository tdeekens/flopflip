import React from 'react';
import { AdapterContext } from '@flopflip/react';
import {
  AdapterContext as AdapterContextType,
  AdapterStatus as AdapterStatusType,
} from '@flopflip/types';

export default function useAdapterStatus(): AdapterStatusType {
  const adapterContext: AdapterContextType = React.useContext(AdapterContext);

  React.useDebugValue(adapterContext.status);

  return adapterContext.status;
}
