import { TAdapter } from '@flopflip/types';
import React from 'react';

function useAdapterSubscription(adapter: TAdapter) {
  React.useEffect(() => {
    if (adapter.subscribe) {
      adapter.subscribe();
    }

    return () => {
      if (adapter.unsubscribe) {
        adapter.unsubscribe();
      }
    };
  }, [adapter]);
}

export default useAdapterSubscription;
