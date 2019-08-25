import React from 'react';
import { AdapterContext } from '@flopflip/react';
import {
  AdapterContext as AdapterContextType,
  ReconfigureAdapter as ReconfigureAdapterType,
} from '@flopflip/types';

export default function useAdapterReconfiguration():
  | Error
  | ReconfigureAdapterType {
  if (typeof React.useContext === 'function') {
    const adapterContext: AdapterContextType = React.useContext(AdapterContext);

    return adapterContext.reconfigure;
  }

  throw new Error(
    'React hooks are not available in your currently installed version of React.'
  );
}
