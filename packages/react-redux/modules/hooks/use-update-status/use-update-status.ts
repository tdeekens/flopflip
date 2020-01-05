import React from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { AdapterStatus } from '@flopflip/types';
import { updateStatus } from '../../ducks';

const useUpdateStatus = () => {
  const dispatch = useDispatch<Dispatch<ReturnType<typeof updateStatus>>>();
  return React.useCallback(
    (status: AdapterStatus) => dispatch(updateStatus(status)),
    [dispatch]
  );
};

export { useUpdateStatus };
