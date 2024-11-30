import {
  selectAdapterConfigurationStatus,
  useAdapterContext,
} from '@flopflip/react';
import type { TAdapterIdentifiers } from '@flopflip/types';
import { useDebugValue } from 'react';

type TUseAdapterStatusArgs = { adapterIdentifiers?: TAdapterIdentifiers[] };
function useAdapterStatus({ adapterIdentifiers }: TUseAdapterStatusArgs = {}) {
  const { status } = useAdapterContext();

  const adapterStatus = selectAdapterConfigurationStatus(
    status,
    adapterIdentifiers
  );

  useDebugValue({ adapterStatus });

  return adapterStatus;
}

export { useAdapterStatus };
