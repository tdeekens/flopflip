import {
  type TAdapterEventHandlers,
  type TAdapterStatusChange,
} from '@flopflip/types';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { updateStatus } from '../../ducks';

const useUpdateStatus = (): TAdapterEventHandlers['onStatusStateChange'] => {
  const dispatch = useDispatch<Dispatch<ReturnType<typeof updateStatus>>>();
  return useCallback(
    (statusChange: TAdapterStatusChange) =>
      dispatch(updateStatus(statusChange)),
    [dispatch]
  );
};

export { useUpdateStatus };
