import React from 'react';
import { AdapterContext } from '@flopflip/react';
import {
  AdapterContext as AdapterContextType,
  AdapterStatus as AdapterStatusType,
} from '@flopflip/types';

export default function useAdapterStatus(): Error | AdapterStatusType {
  if (typeof React.useContext === 'function') {
    /**
     * NODE: `createReactContext` and `React.Context` return incomptaible types which
     * can not be interchanged. Until `createReactContext` is in use this
     * has to remain.
     */
    const adapterContext: AdapterContextType = React.useContext(
      AdapterContext as any
    );

    return adapterContext.status;
  }

  throw new Error(
    'React hooks are not available in your currently installed version of React.'
  );
}
