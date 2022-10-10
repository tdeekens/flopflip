import { useDebugValue } from 'react';
import { useSelector } from 'react-redux';

import { selectStatus } from '../../ducks/status';

export default function useAdapterStatus() {
  const adapterStatus = useSelector(selectStatus);

  useDebugValue({ adapterStatus });

  return adapterStatus;
}
