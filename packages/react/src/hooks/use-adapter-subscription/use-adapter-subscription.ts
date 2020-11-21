import type { TAdapter } from '@flopflip/types';
import { TAdapterSubscriptionStatus } from '@flopflip/types';

import React from 'react';

function useAdapterSubscription(adapter: TAdapter) {
  /**
   * NOTE:
   *    This state needs to be duplicated in a React.ref
   *    as under test multiple instances of flopflip might
   *    be rendered. This yields in them competing in adapter
   *    subscription state (e.g. A unsubscribing and B subscribing
   *    which yields A and B being subscribed as the adapter
   *    is a singleton).
   */
  const useAdapterSubscriptionStatusRef = React.useRef(
    TAdapterSubscriptionStatus.Subscribed
  );

  const { subscribe, unsubscribe } = adapter;

  React.useEffect(() => {
    if (subscribe) {
      subscribe();
    }

    useAdapterSubscriptionStatusRef.current =
      TAdapterSubscriptionStatus.Subscribed;

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }

      useAdapterSubscriptionStatusRef.current =
        TAdapterSubscriptionStatus.Unsubscribed;
    };
  }, [subscribe, unsubscribe]);

  return (demandedAdapterSubscriptionStatus: TAdapterSubscriptionStatus) =>
    useAdapterSubscriptionStatusRef.current ===
    demandedAdapterSubscriptionStatus;
}

export default useAdapterSubscription;
