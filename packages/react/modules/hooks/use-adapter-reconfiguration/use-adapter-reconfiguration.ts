import React from 'react';
import { AdapterContext } from '@flopflip/react';
import {
  AdapterContext as AdapterContextType,
  ReconfigureAdapter as ReconfigureAdapterType,
} from '@flopflip/types';

export default function useAdapterReconfiguration(): ReconfigureAdapterType {
  const adapterContext: AdapterContextType = React.useContext(AdapterContext);

  return adapterContext.reconfigure;
}
