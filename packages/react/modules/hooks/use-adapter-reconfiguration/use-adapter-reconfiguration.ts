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
    /**
     * NODE: `createReactContext` and `React.Context` return incomptaible types which
     * can not be interchanged. Until `createReactContext` is in use this
     * has to remain.
     */
    const adapterContext: AdapterContextType = React.useContext(
      AdapterContext as any
    );

    return adapterContext.reconfigure;
  }

  throw new Error(
    'React hooks are not available in your currently installed version of React.'
  );
}
