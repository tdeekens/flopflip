import {
  type TAdapterEventHandlers,
  type TAdapterIdentifiers,
  type TFlagsChange,
} from '@flopflip/types';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';

import { updateFlags } from '../../ducks';

type TUseUpdateFlagsOptions = {
  adapterIdentifiers: TAdapterIdentifiers[];
};
const useUpdateFlags = ({
  adapterIdentifiers,
}: TUseUpdateFlagsOptions): TAdapterEventHandlers['onFlagsStateChange'] => {
  const dispatch = useDispatch<Dispatch<ReturnType<typeof updateFlags>>>();

  return useCallback(
    (flagsChange: TFlagsChange) =>
      dispatch(updateFlags(flagsChange, adapterIdentifiers)),
    [dispatch, adapterIdentifiers]
  );
};

export { useUpdateFlags };
