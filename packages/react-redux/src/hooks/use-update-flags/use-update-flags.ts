import type {
  TFlagsChange,
  TAdapterEventHandlers,
  TAdapterInterfaceIdentifiers,
} from '@flopflip/types';

import { useCallback } from 'react';
import { Dispatch } from 'redux';
import { useDispatch } from 'react-redux';
import { updateFlags } from '../../ducks';

type TUseUpdateFlagsOptions = {
  adapterInterfaceIdentifiers: TAdapterInterfaceIdentifiers[];
};
const useUpdateFlags = ({
  adapterInterfaceIdentifiers,
}: TUseUpdateFlagsOptions): TAdapterEventHandlers['onFlagsStateChange'] => {
  const dispatch = useDispatch<Dispatch<ReturnType<typeof updateFlags>>>();

  return useCallback(
    (flagsChange: TFlagsChange) =>
      dispatch(updateFlags(flagsChange, adapterInterfaceIdentifiers)),
    [dispatch, adapterInterfaceIdentifiers]
  );
};

export { useUpdateFlags };
