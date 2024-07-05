import { AdapterContext, createAdapterContext } from '@flopflip/react';
import {
  AdapterConfigurationStatus,
  AdapterSubscriptionStatus,
  type TAdapterIdentifiers,
  type TAdaptersStatus,
  type TFlags,
  type TReconfigureAdapter,
  adapterIdentifiers,
} from '@flopflip/types';
// biome-ignore lint/style/useImportType: <explanation>
import React from 'react';

import { FlagsContext, createIntialFlagsContext } from '../flags-context';

type TProps = {
  readonly children: React.ReactNode;
  readonly flags: TFlags;
  readonly adapterIdentifiers?: TAdapterIdentifiers[];
  readonly reconfigure?: TReconfigureAdapter;
  readonly status?: TAdaptersStatus;
};

const defaultProps: Pick<
  TProps,
  'adapterIdentifiers' | 'reconfigure' | 'status'
> = {
  adapterIdentifiers: ['test'],
  status: {
    ...Object.fromEntries(
      Object.values(adapterIdentifiers).map((adapterInterfaceIdentifier) => [
        adapterInterfaceIdentifier,
        {
          subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
          configurationStatus: AdapterConfigurationStatus.Configured,
        },
      ])
    ),
  },
};

function TestProvider({
  adapterIdentifiers = defaultProps.adapterIdentifiers,
  reconfigure,
  flags,
  children,
  status = defaultProps.status,
}: TProps) {
  const adapterContextValue = createAdapterContext(
    adapterIdentifiers,
    reconfigure,
    status
  );
  const flagsContextValue = createIntialFlagsContext(
    // @ts-expect-error Can not remember. Sorry to myself.
    adapterIdentifiers,
    flags
  );

  return (
    <AdapterContext.Provider value={adapterContextValue}>
      <FlagsContext.Provider value={flagsContextValue}>
        {children}
      </FlagsContext.Provider>
    </AdapterContext.Provider>
  );
}

TestProvider.displayName = 'TestProviderFlopFlip';

export { TestProvider };
