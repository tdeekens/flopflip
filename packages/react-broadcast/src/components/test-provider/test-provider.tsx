import { AdapterContext, createAdapterContext } from '@flopflip/react';
import {
  type TAdapterIdentifiers,
  type TAdapterStatus,
  type TFlags,
  type TReconfigureAdapter,
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

function TestProvider(props: TProps) {
  const adapterContextValue = createAdapterContext(
    props.adapterIdentifiers,
    props.reconfigure,
    props.status
  );
  const flagsContextValue = createIntialFlagsContext(
<<<<<<< HEAD
    // @ts-expect-error Can not remember. Sorry to myself.
||||||| parent of e49d8a66 (refactor: to use vitest over jest)
    // @ts-expect-error
=======
    // @ts-expect-error I can't remember ;)
>>>>>>> e49d8a66 (refactor: to use vitest over jest)
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
