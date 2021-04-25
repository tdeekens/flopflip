import { AdapterContext, createAdapterContext } from '@flopflip/react';
import type {
  TAdapterIdentifiers,
  TAdapterStatus,
  TFlags,
  TReconfigureAdapter,
} from '@flopflip/types';
import {
  AdapterConfigurationStatus,
  AdapterSubscriptionStatus,
} from '@flopflip/types';
import React from 'react';

import { createIntialFlagsContext, FlagsContext } from '../flags-context';

type TProps = {
  children: React.ReactNode;
  flags: TFlags;
  adapterIdentifiers?: TAdapterIdentifiers[];
  reconfigure?: TReconfigureAdapter;
  status?: TAdapterStatus;
};

const defaultProps: Pick<
  TProps,
  'adapterIdentifiers' | 'reconfigure' | 'status'
> = {
  adapterIdentifiers: ['test'],
  status: {
    subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
    configurationStatus: AdapterConfigurationStatus.Configured,
  },
};

const TestProvider = (props: TProps) => {
  const adapterContextValue = createAdapterContext(
    props.adapterIdentifiers,
    props.reconfigure,
    props.status
  );
  const flagsContextValue = createIntialFlagsContext(
    // @ts-expect-error
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
};

TestProvider.displayName = 'TestProviderFlopFlip';
TestProvider.defaultProps = defaultProps;

export { TestProvider };
