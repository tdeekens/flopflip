import React from 'react';
import { useSelector } from 'react-redux';
import { selectStatus } from '../../ducks/status';

export default function useAdapterStatus() {
  const status = useSelector(selectStatus);

  React.useDebugValue(status);

  return status;
}
