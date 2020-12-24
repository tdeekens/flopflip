import { useDebugValue } from 'react';
import {
  useAdapterContext,
  selectAdapterConfigurationStatus,
} from '@flopflip/react';

export default function useAdapterStatus() {
  const { status } = useAdapterContext();

  const adapterStatus = selectAdapterConfigurationStatus(
    status.configurationStatus
  );

  useDebugValue({ adapterStatus });

  return adapterStatus;
}
