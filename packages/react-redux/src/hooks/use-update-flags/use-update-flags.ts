import type { TFlagsChange, TAdapterEventHandlers } from '@flopflip/types';

import React from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { updateFlags } from '../../ducks';

const useUpdateFlags = (): TAdapterEventHandlers['onFlagsStateChange'] => {
  const dispatch = useDispatch<Dispatch<ReturnType<typeof updateFlags>>>();
  return React.useCallback(
    (flags: TFlagsChange) => dispatch(updateFlags(flags)),
    [dispatch]
  );
};

export { useUpdateFlags };
