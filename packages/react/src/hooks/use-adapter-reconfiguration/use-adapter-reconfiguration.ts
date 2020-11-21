import type { TAdapterContext } from '@flopflip/types';

import React from 'react';
import { AdapterContext } from '../../components';

export default function useAdapterReconfiguration() {
  const adapterContext: TAdapterContext = React.useContext(AdapterContext);

  return adapterContext.reconfigure;
}
