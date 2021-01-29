import type {
  TFlags,
  TReconfigureAdapter,
  TAdapterStatus,
  TAdapterIdentifiers,
} from '@flopflip/types';

import React from 'react';
import {
  AdapterConfigurationStatus,
  AdapterSubscriptionStatus,
} from '@flopflip/types';
import { createAdapterContext, AdapterContext } from '@flopflip/react';
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

const TestContextProvider = (props: TProps) => {
  const adapterContextValue = createAdapterContext(
    props.adapterIdentifiers,
    props.reconfigure,
    props.status
  );
  const flagsContextValue = createIntialFlagsContext(
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

TestContextProvider.displayName = 'FlopflipTestContextProvider';
TestContextProvider.defaultProps = defaultProps;

export { TestContextProvider };
