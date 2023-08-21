import { AdapterContext, createAdapterContext } from '@flopflip/react';
import {
  AdapterConfigurationStatus,
  adapterIdentifiers,
  AdapterSubscriptionStatus,
  type TAdapterIdentifiers,
  type TAdaptersStatus,
  type TFlags,
  type TReconfigureAdapter,
} from '@flopflip/types';
import React from 'react';

import { createIntialFlagsContext, FlagsContext } from '../flags-context';

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

function TestProvider(props: TProps) {
  const adapterContextValue = createAdapterContext(
    props.adapterIdentifiers,
    props.reconfigure,
    props.status
  );
  const flagsContextValue = createIntialFlagsContext(
    // @ts-expect-error Can not remember. Sorry to myself.
    props.adapterIdentifiers,
    props.flags
  );

  return (
    <AdapterContext.Provider value={adapterContextValue}>
      <FlagsContext.Provider value={flagsContextValue}>
        {props.children}
      </FlagsContext.Provider>
    </AdapterContext.Provider>
  );
}

TestProvider.displayName = 'TestProviderFlopFlip';
TestProvider.defaultProps = defaultProps;

export { TestProvider };
