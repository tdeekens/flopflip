import {
  AdapterConfigurationStatus,
  type TAdapterContext,
  type TAdapterIdentifiers,
  type TAdaptersStatus,
  type TReconfigureAdapter,
} from '@flopflip/types';
import { createContext } from 'react';

const initialReconfigureAdapter: TReconfigureAdapter = () => undefined;

const createAdapterContext = (
  adapterIdentifiers?: TAdapterIdentifiers[],
  reconfigure?: TReconfigureAdapter,
  status?: TAdaptersStatus
): TAdapterContext => ({
  adapterEffectIdentifiers: adapterIdentifiers ?? [],
  reconfigure: reconfigure ?? initialReconfigureAdapter,
  status,
});

const initialAdapterContext = createAdapterContext();
const AdapterContext = createContext(initialAdapterContext);

function hasEveryAdapterStatus(
  adapterConfigurationStatus: AdapterConfigurationStatus,
  adaptersStatus?: TAdaptersStatus
) {
  if (Object.keys(adaptersStatus ?? {}).length === 0) return false;

  return Object.values(adaptersStatus ?? {}).every(
    (adapterStatus) =>
      adapterStatus.configurationStatus === adapterConfigurationStatus
  );
}

const selectAdapterConfigurationStatus = (adaptersStatus?: TAdaptersStatus) => {
  const isReady = hasEveryAdapterStatus(
    AdapterConfigurationStatus.Configured,
    adaptersStatus
  );
  const isUnconfigured = hasEveryAdapterStatus(
    AdapterConfigurationStatus.Unconfigured,
    adaptersStatus
  );
  const isConfiguring = hasEveryAdapterStatus(
    AdapterConfigurationStatus.Configuring,
    adaptersStatus
  );
  const isConfigured = hasEveryAdapterStatus(
    AdapterConfigurationStatus.Configured,
    adaptersStatus
  );

  const status = { isReady, isUnconfigured, isConfiguring, isConfigured };

  return status;
};

export default AdapterContext;
export { createAdapterContext, selectAdapterConfigurationStatus };
