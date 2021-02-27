import type { TAdapter } from '@flopflip/types';
import { AdapterSubscriptionStatus } from '@flopflip/types';
import { useEffect, useRef } from 'react';

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
  const useAdapterSubscriptionStatusRef = useRef(
    AdapterSubscriptionStatus.Subscribed
  );

  const { subscribe, unsubscribe } = adapter;

  useEffect(() => {
    if (subscribe) {
      subscribe();
    }

    useAdapterSubscriptionStatusRef.current =
      AdapterSubscriptionStatus.Subscribed;

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }

      useAdapterSubscriptionStatusRef.current =
        AdapterSubscriptionStatus.Unsubscribed;
    };
  }, [subscribe, unsubscribe]);

  return (demandedAdapterSubscriptionStatus: AdapterSubscriptionStatus) =>
    useAdapterSubscriptionStatusRef.current ===
    demandedAdapterSubscriptionStatus;
}

export default useAdapterSubscription;
