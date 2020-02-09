import React from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { TAdapterStatus } from '@flopflip/types';
import { updateStatus } from '../../ducks';

const useUpdateStatus = () => {
  const dispatch = useDispatch<Dispatch<ReturnType<typeof updateStatus>>>();
  return React.useCallback(
    (status: TAdapterStatus) => dispatch(updateStatus(status)),
    [dispatch]
  );
};

export { useUpdateStatus };
