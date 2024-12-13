import {
  type TAdapterEventHandlers,
  type TAdapterStatusChange,
  adapterIdentifiers as allAdapterIdentifiers,
} from '@flopflip/types';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { updateStatus } from './ducks/status';

const useUpdateStatus = (): TAdapterEventHandlers['onStatusStateChange'] => {
  const dispatch = useDispatch();

  return useCallback(
    (statusChange: TAdapterStatusChange) =>
      dispatch(updateStatus(statusChange, Object.keys(allAdapterIdentifiers))),
    [dispatch]
  );
};

export { useUpdateStatus };
