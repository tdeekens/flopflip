import React from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { TFlags } from '@flopflip/types';
import { updateFlags } from '../../ducks';

const useUpdateFlags = () => {
  const dispatch = useDispatch<Dispatch<ReturnType<typeof updateFlags>>>();
  return React.useCallback((flags: TFlags) => dispatch(updateFlags(flags)), [
    dispatch,
  ]);
};

export { useUpdateFlags };
