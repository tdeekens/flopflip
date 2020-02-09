import { TAdapterStatus } from '@flopflip/types';

import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatus } from '../../ducks/status';

export default function useAdapterStatus(): TAdapterStatus {
  const status = useSelector(selectStatus);

  React.useDebugValue(status);

  return status;
}
