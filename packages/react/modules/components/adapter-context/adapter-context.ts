import React from 'react';
import {
  TAdapterContext,
  TAdapterStatus,
  TReconfigureAdapter,
} from '@flopflip/types';

const initialReconfigureAdapter: TReconfigureAdapter = () => undefined;
const initialAdapterStatus: TAdapterStatus = {
  isReady: false,
  isConfigured: false,
};
const createAdapterContext = (
  reconfigure?: TReconfigureAdapter,
  status?: TAdapterStatus
): TAdapterContext => ({
  reconfigure: reconfigure ?? initialReconfigureAdapter,
  status: status ?? initialAdapterStatus,
});

const initialAdapterContext = createAdapterContext();
const AdapterContext = React.createContext(initialAdapterContext);

export default AdapterContext;
export { createAdapterContext };
