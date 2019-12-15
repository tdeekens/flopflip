import React from 'react';
import {
  AdapterContext as AdapterContextType,
  AdapterStatus as AdapterStatusType,
  ReconfigureAdapter as ReconfigureAdapterType,
} from '@flopflip/types';

const initialReconfigureAdapter: ReconfigureAdapterType = (): void => undefined;
const initialAdapterStatus: AdapterStatusType = {
  isReady: false,
  isConfigured: false,
};
const createAdapterContext = (
  reconfigure?: ReconfigureAdapterType,
  status?: AdapterStatusType
): AdapterContextType => ({
  reconfigure: reconfigure ?? initialReconfigureAdapter,
  status: status ?? initialAdapterStatus,
});

const initialAdapterContext = createAdapterContext();
const AdapterContext = React.createContext(initialAdapterContext);

export default AdapterContext;
export { createAdapterContext };
