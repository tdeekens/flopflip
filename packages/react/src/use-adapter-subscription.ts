import { AdapterSubscriptionStatus, type TAdapter } from '@flopflip/types';
import { useCallback, useEffect, useRef } from 'react';

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  return useCallback(
    (demandedAdapterSubscriptionStatus: AdapterSubscriptionStatus) =>
      useAdapterSubscriptionStatusRef.current ===
      demandedAdapterSubscriptionStatus,
    [useAdapterSubscriptionStatusRef]
  );
}

export { useAdapterSubscription };
