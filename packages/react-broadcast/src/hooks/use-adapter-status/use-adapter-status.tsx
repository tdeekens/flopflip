import {
  selectAdapterConfigurationStatus,
  useAdapterContext,
} from '@flopflip/react';
import { useDebugValue } from 'react';

export default function useAdapterStatus() {
  const { status } = useAdapterContext();

  const adapterStatus = selectAdapterConfigurationStatus(
    status.configurationStatus
  );

  useDebugValue({ adapterStatus });

  return adapterStatus;
}
