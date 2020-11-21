import type { TAdapterStatusChange } from '@flopflip/types';

import React from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { updateStatus } from '../../ducks';

const useUpdateStatus = () => {
  const dispatch = useDispatch<Dispatch<ReturnType<typeof updateStatus>>>();
  return React.useCallback(
    (status: Readonly<TAdapterStatusChange>) => dispatch(updateStatus(status)),
    [dispatch]
  );
};

export { useUpdateStatus };
