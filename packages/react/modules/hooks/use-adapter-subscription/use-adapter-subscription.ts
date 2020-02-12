import { TAdapter } from '@flopflip/types';
import React from 'react';

function useAdapterSubscription(adapter: TAdapter) {
  React.useEffect(() => {
    return () => {
      if (adapter.unsubscribe) {
        adapter.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}

export default useAdapterSubscription;
