import type {
  TReconfigureAdapter,
  TAdapterContext,
  TAdapterStatus,
} from '@flopflip/types';
import {
  TAdapterSubscriptionStatus,
  TAdapterConfigurationStatus,
} from '@flopflip/types';

import React from 'react';

const initialReconfigureAdapter: TReconfigureAdapter = () => undefined;
const initialAdapterStatus: TAdapterStatus = {
  subscriptionStatus: TAdapterSubscriptionStatus.Subscribed,
  configurationStatus: TAdapterConfigurationStatus.Unconfigured,
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
  configurationStatus?: TAdapterConfigurationStatus
) => ({
  isReady: configurationStatus === TAdapterConfigurationStatus.Configured,
  isUnconfigured:
    configurationStatus === TAdapterConfigurationStatus.Unconfigured,
  isConfiguring:
    configurationStatus === TAdapterConfigurationStatus.Configuring,
  isConfigured: configurationStatus === TAdapterConfigurationStatus.Configured,
});

const useAdapterContext = () => React.useContext(AdapterContext);

export default AdapterContext;
export {
  createAdapterContext,
  useAdapterContext,
  selectAdapterConfigurationStatus,
};
