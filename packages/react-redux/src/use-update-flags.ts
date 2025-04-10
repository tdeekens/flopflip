import type {
  TAdapterEventHandlers,
  TAdapterIdentifiers,
  TFlagsChange,
} from '@flopflip/types';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { updateFlags } from './ducks/flags';

type TUseUpdateFlagsOptions = {
  adapterIdentifiers: TAdapterIdentifiers[];
};
const useUpdateFlags = ({
  adapterIdentifiers,
}: TUseUpdateFlagsOptions): TAdapterEventHandlers['onFlagsStateChange'] => {
  const dispatch = useDispatch();

  return useCallback(
    (flagsChange: TFlagsChange) =>
      dispatch(updateFlags(flagsChange, adapterIdentifiers)),
    [dispatch, adapterIdentifiers]
  );
};

export { useUpdateFlags };
