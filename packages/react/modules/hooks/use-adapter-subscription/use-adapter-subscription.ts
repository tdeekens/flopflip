import { TAdapter, TAdapterSubscriptionStatus } from '@flopflip/types';
import React from 'react';

function useAdapterSubscription(adapter: TAdapter) {
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
