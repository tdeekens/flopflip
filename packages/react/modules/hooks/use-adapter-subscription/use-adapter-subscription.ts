import { TAdapter } from '@flopflip/types';
import React from 'react';

function useAdapterSubscription(adapter: TAdapter) {
  const { subscribe, unsubscribe } = adapter;

  React.useEffect(() => {
    if (subscribe) {
      subscribe();
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [subscribe, unsubscribe]);
}

export default useAdapterSubscription;
