import React from 'react';
import {
  useAdapterContext,
  selecAdapterConfigurationStatus,
} from '@flopflip/react';

export default function useAdapterStatus() {
  const { status } = useAdapterContext();

  const adapterStatus = selecAdapterConfigurationStatus(
    status.configurationStatus
  );

  React.useDebugValue({ adapterStatus });

  return adapterStatus;
}
