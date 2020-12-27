import type { TFlagsChange, TAdapterEventHandlers } from '@flopflip/types';

import { useCallback } from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { updateFlags } from '../../ducks';

const useUpdateFlags = (): TAdapterEventHandlers['onFlagsStateChange'] => {
  const dispatch = useDispatch<Dispatch<ReturnType<typeof updateFlags>>>();
  return useCallback(
    (flagsChange: TFlagsChange) => dispatch(updateFlags(flagsChange)),
    [dispatch]
  );
};

export { useUpdateFlags };
