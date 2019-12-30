import React from 'react';
import { ConfigureAdapter } from '@flopflip/react';
import {
  Flags,
  Adapter,
  AdapterArgs,
  ConfigureAdapterChildren,
} from '@flopflip/types';
import { useUpdateFlags, useUpdateStatus } from '../../hooks';

type Props = {
  children?: ConfigureAdapterChildren;
  shouldDeferAdapterConfiguration?: boolean;
  defaultFlags?: Flags;
  adapterArgs: AdapterArgs;
  adapter: Adapter;
};

const defaultProps: Pick<
  Props,
  'defaultFlags' | 'shouldDeferAdapterConfiguration'
> = {
  defaultFlags: {},
  shouldDeferAdapterConfiguration: false,
};

const Configure = (props: Props) => {
  const handleUpdateFlags = useUpdateFlags();
  const handleUpdateStatus = useUpdateStatus();

  return (
    <ConfigureAdapter
      adapter={props.adapter}
      adapterArgs={props.adapterArgs}
      defaultFlags={props.defaultFlags}
      shouldDeferAdapterConfiguration={props.shouldDeferAdapterConfiguration}
      onFlagsStateChange={handleUpdateFlags}
      onStatusStateChange={handleUpdateStatus}
    >
      {props.children}
    </ConfigureAdapter>
  );
};

Configure.displayName = 'ConfigureFlopflip';
Configure.defaultProps = defaultProps;

export default Configure;
