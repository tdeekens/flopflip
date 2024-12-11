import type { TAdapterContext } from '@flopflip/types';
import { useContext } from 'react';

import { AdapterContext } from './adapter-context';

function useAdapterReconfiguration() {
  const adapterContext: TAdapterContext = useContext(AdapterContext);

  return adapterContext.reconfigure;
}

export { useAdapterReconfiguration };
