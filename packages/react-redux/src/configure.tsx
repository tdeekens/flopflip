import { ConfigureAdapter, useAdapterSubscription } from '@flopflip/react';
import type {
  TAdapter,
  TConfigureAdapterChildren,
  TConfigureAdapterProps,
  TFlags,
} from '@flopflip/types';
import React from 'react';

import { useUpdateFlags } from './use-update-flags';
import { useUpdateStatus } from './use-update-status';

type TBaseProps = {
  readonly children?: TConfigureAdapterChildren;
  readonly shouldDeferAdapterConfiguration?: boolean;
  readonly defaultFlags?: TFlags;
};
type TProps<AdapterInstance extends TAdapter> = TBaseProps &
  TConfigureAdapterProps<AdapterInstance>;

function Configure<AdapterInstance extends TAdapter>({
  adapter,
  adapterArgs,
  children,
  defaultFlags = {},
  shouldDeferAdapterConfiguration = false,
}: TProps<AdapterInstance>) {
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

export { Configure };
