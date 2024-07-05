import type { TAdapterContext } from '@flopflip/types';
import { useContext } from 'react';

import { AdapterContext } from '../../components';

export default function useAdapterReconfiguration() {
  const adapterContext: TAdapterContext = useContext(AdapterContext);

  return adapterContext.reconfigure;
}
