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
  adaptersStatus?: TAdaptersStatus,
  adapterIdentifiers?: TAdapterIdentifiers[]
) {
  if (Object.keys(adaptersStatus ?? {}).length === 0) return false;

  if (Array.isArray(adapterIdentifiers)) {
    return adapterIdentifiers.every(
      (adapterIdentifier) =>
        adaptersStatus?.[adapterIdentifier].configurationStatus ===
        adapterConfigurationStatus
    );
  }

  return Object.values(adaptersStatus ?? {}).every(
    (adapterStatus) =>
      adapterStatus.configurationStatus === adapterConfigurationStatus
  );
}

const selectAdapterConfigurationStatus = (
  adaptersStatus?: TAdaptersStatus,
  adapterIdentifiers?: TAdapterIdentifiers[]
) => {
  const isReady = hasEveryAdapterStatus(
    AdapterConfigurationStatus.Configured,
    adaptersStatus,
    adapterIdentifiers
  );
  const isUnconfigured = hasEveryAdapterStatus(
    AdapterConfigurationStatus.Unconfigured,
    adaptersStatus,
    adapterIdentifiers
  );
  const isConfiguring = hasEveryAdapterStatus(
    AdapterConfigurationStatus.Configuring,
    adaptersStatus,
    adapterIdentifiers
  );
  const isConfigured = hasEveryAdapterStatus(
    AdapterConfigurationStatus.Configured,
    adaptersStatus,
    adapterIdentifiers
  );

  const status = { isReady, isUnconfigured, isConfiguring, isConfigured };

  return status;
};

export default AdapterContext;
export { createAdapterContext, selectAdapterConfigurationStatus };
