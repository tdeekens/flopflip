import type {
  TReconfigureAdapter,
  TAdapterContext,
  TAdapterStatus,
  TAdapterIdentifiers,
} from '@flopflip/types';
import {
  AdapterSubscriptionStatus,
  AdapterConfigurationStatus,
} from '@flopflip/types';

import { createContext } from 'react';

const initialReconfigureAdapter: TReconfigureAdapter = () => undefined;
const initialAdapterStatus: TAdapterStatus = {
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
};
const createAdapterContext = (
  adapterIdentifiers?: TAdapterIdentifiers[],
  reconfigure?: TReconfigureAdapter,
  status?: TAdapterStatus
): TAdapterContext => ({
  adapterEffectIdentifiers: adapterIdentifiers ?? [],
  reconfigure: reconfigure ?? initialReconfigureAdapter,
  status: status ?? initialAdapterStatus,
});

const initialAdapterContext = createAdapterContext();
const AdapterContext = createContext(initialAdapterContext);

const selectAdapterConfigurationStatus = (
  configurationStatus?: AdapterConfigurationStatus
) => {
  const isReady = configurationStatus === AdapterConfigurationStatus.Configured;
  const isUnconfigured =
    configurationStatus === AdapterConfigurationStatus.Unconfigured;
  const isConfiguring =
    configurationStatus === AdapterConfigurationStatus.Configuring;
  const isConfigured =
    configurationStatus === AdapterConfigurationStatus.Configured;

  return { isReady, isUnconfigured, isConfiguring, isConfigured };
};

export default AdapterContext;
export { createAdapterContext, selectAdapterConfigurationStatus };
