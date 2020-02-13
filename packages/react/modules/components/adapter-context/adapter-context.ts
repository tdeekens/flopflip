import React from 'react';
import {
  TAdapterContext,
  TAdapterStatus,
  TReconfigureAdapter,
  TAdapterSubscriptionStatus,
} from '@flopflip/types';

const initialReconfigureAdapter: TReconfigureAdapter = () => undefined;
const initialAdapterStatus: TAdapterStatus = {
  subscriptionStatus: TAdapterSubscriptionStatus.Subscribed,
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
