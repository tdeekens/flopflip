import type {
  TAdapterStatusChange,
  TAdapterEventHandlers,
} from '@flopflip/types';

import React from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { updateStatus } from '../../ducks';

const useUpdateStatus = (): TAdapterEventHandlers['onStatusStateChange'] => {
  const dispatch = useDispatch<Dispatch<ReturnType<typeof updateStatus>>>();
  return React.useCallback(
    (status: TAdapterStatusChange) => dispatch(updateStatus(status)),
    [dispatch]
  );
};

export { useUpdateStatus };
