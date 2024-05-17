import { ConfigureAdapter, useAdapterSubscription } from '@flopflip/react';
import {
  type TAdapter,
  type TConfigureAdapterChildren,
  type TConfigureAdapterProps,
  type TFlags,
} from '@flopflip/types';
import React from 'react';

import { useUpdateFlags, useUpdateStatus } from '../../hooks';

type BaseProps = {
  readonly children?: TConfigureAdapterChildren;
  readonly shouldDeferAdapterConfiguration?: boolean;
  readonly defaultFlags?: TFlags;
};
type Props<AdapterInstance extends TAdapter> = BaseProps &
  TConfigureAdapterProps<AdapterInstance>;

function Configure<AdapterInstance extends TAdapter>({
  adapter,
  adapterArgs,
  children,
  defaultFlags = {},
  shouldDeferAdapterConfiguration = false,
}: Props<AdapterInstance>) {
  const adapterIdentifiers = [adapter.id];
  const handleUpdateFlags = useUpdateFlags({ adapterIdentifiers });
  const handleUpdateStatus = useUpdateStatus();

  useAdapterSubscription(adapter);

  return (
    <ConfigureAdapter
      adapter={adapter}
      adapterArgs={adapterArgs}
      defaultFlags={defaultFlags}
      shouldDeferAdapterConfiguration={shouldDeferAdapterConfiguration}
      onFlagsStateChange={handleUpdateFlags}
      onStatusStateChange={handleUpdateStatus}
    >
      {children}
    </ConfigureAdapter>
  );
}

Configure.displayName = 'ConfigureFlopflip';

export default Configure;
