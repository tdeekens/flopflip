import type {
  TReconfigureAdapter,
  TAdapterContext,
  TAdapterStatus,
} from '@flopflip/types';
import {
  AdapterSubscriptionStatus,
  AdapterConfigurationStatus,
} from '@flopflip/types';

import React from 'react';

const initialReconfigureAdapter: TReconfigureAdapter = () => undefined;
const initialAdapterStatus: TAdapterStatus = {
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
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

const selectAdapterConfigurationStatus = (
  configurationStatus?: AdapterConfigurationStatus
) => ({
  isReady: configurationStatus === AdapterConfigurationStatus.Configured,
  isUnconfigured:
    configurationStatus === AdapterConfigurationStatus.Unconfigured,
  isConfiguring: configurationStatus === AdapterConfigurationStatus.Configuring,
  isConfigured: configurationStatus === AdapterConfigurationStatus.Configured,
});

const useAdapterContext = () => React.useContext(AdapterContext);

export default AdapterContext;
export {
  createAdapterContext,
  useAdapterContext,
  selectAdapterConfigurationStatus,
};
