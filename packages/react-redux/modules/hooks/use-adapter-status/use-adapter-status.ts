import { AdapterStatus as AdapterStatusType } from '@flopflip/types';

import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatus } from '../../ducks/status';

export default function useAdapterStatus(): AdapterStatusType {
  const status = useSelector(selectStatus);

  React.useDebugValue(status);

  return status;
}
