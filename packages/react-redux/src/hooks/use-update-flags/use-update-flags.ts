import type { TFlagsChange, TUpdateFlagsAction } from '@flopflip/types';

import React from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { updateFlags } from '../../ducks';

const useUpdateFlags = (): TUpdateFlagsAction => {
  const dispatch = useDispatch<Dispatch<ReturnType<typeof updateFlags>>>();
  return React.useCallback(
    (flags: Readonly<TFlagsChange>) => dispatch(updateFlags(flags)),
    [dispatch]
  );
};

export { useUpdateFlags };
