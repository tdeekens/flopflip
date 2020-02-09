import React from 'react';
import { ConfigureAdapter } from '@flopflip/react';
import {
  TFlags,
  TAdapter,
  TConfigureAdapterProps,
  TConfigureAdapterChildren,
} from '@flopflip/types';
import { useUpdateFlags, useUpdateStatus } from '../../hooks';

type BaseProps = {
  children?: TConfigureAdapterChildren;
  shouldDeferAdapterConfiguration?: boolean;
  defaultFlags?: TFlags;
};
type Props<AdapterInstance extends TAdapter> = BaseProps &
  TConfigureAdapterProps<AdapterInstance>;

const defaultProps: Pick<
  BaseProps,
  'defaultFlags' | 'shouldDeferAdapterConfiguration'
> = {
  defaultFlags: {},
  shouldDeferAdapterConfiguration: false,
};

const Configure = <AdapterInstance extends TAdapter>(
  props: Props<AdapterInstance>
) => {
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
