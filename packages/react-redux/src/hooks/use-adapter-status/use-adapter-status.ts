import type { TAdapterIdentifiers } from '@flopflip/types';
import { useDebugValue } from 'react';
import { useSelector } from 'react-redux';

import { selectStatus } from '../../ducks/status';

type TUseAdapterStatusArgs = { adapterIdentifiers?: TAdapterIdentifiers[] };
export default function useAdapterStatus({
  adapterIdentifiers,
}: TUseAdapterStatusArgs = {}) {
  const adapterStatus = useSelector(selectStatus({ adapterIdentifiers }));

  useDebugValue({ adapterStatus });

  return adapterStatus;
}
