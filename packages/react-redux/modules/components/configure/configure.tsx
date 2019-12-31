import React from 'react';
import { ConfigureAdapter } from '@flopflip/react';
import {
  Flags,
  Adapter,
  ConfigureAdapterProps,
  ConfigureAdapterChildren,
} from '@flopflip/types';
import { useUpdateFlags, useUpdateStatus } from '../../hooks';

type BaseProps = {
  children?: ConfigureAdapterChildren;
  shouldDeferAdapterConfiguration?: boolean;
  defaultFlags?: Flags;
};
type Props<AdapterInstance extends Adapter> = BaseProps &
  ConfigureAdapterProps<AdapterInstance>;

const defaultProps: Pick<
  BaseProps,
  'defaultFlags' | 'shouldDeferAdapterConfiguration'
> = {
  defaultFlags: {},
  shouldDeferAdapterConfiguration: false,
};

const Configure = <AdapterInstance extends Adapter>(
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
