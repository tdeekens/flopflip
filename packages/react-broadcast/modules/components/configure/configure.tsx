import React from 'react';
import { ConfigureAdapter, useIsMounted } from '@flopflip/react';
import {
  Flags,
  Adapter,
  AdapterStatus,
  ConfigureAdapterChildren,
  ConfigureAdapterProps,
} from '@flopflip/types';
import { FlagsContext } from '../flags-context';

type BaseProps = {
  children?: ConfigureAdapterChildren;
  shouldDeferAdapterConfiguration?: boolean;
  defaultFlags?: Flags;
};
type Props<AdapterInstance extends Adapter> = BaseProps &
  ConfigureAdapterProps<AdapterInstance>;
type State = {
  flags: Flags;
  status: AdapterStatus;
  configurationId?: string;
};

const Configure = <AdapterInstance extends Adapter>(
  props: Props<AdapterInstance>
) => {
  const isMounted = useIsMounted();
  const [flags, setFlags] = React.useState<State['flags']>({});
  const [status, setStatus] = React.useState<State['status']>({});

  const handleUpdateFlags = React.useCallback(
    (flags: Flags) => {
      if (isMounted.current) {
        setFlags(prevFlags => ({
          ...prevFlags,
          ...flags,
        }));
      }
    },
    [isMounted, setFlags]
  );

  const handleUpdateStatus = React.useCallback(
    (status: AdapterStatus) => {
      if (isMounted.current) {
        setStatus(prevStatus => ({
          ...prevStatus,
          ...status,
        }));
      }
    },
    [isMounted, setStatus]
  );

  return (
    <FlagsContext.Provider value={flags}>
      <ConfigureAdapter
        adapter={props.adapter}
        adapterArgs={props.adapterArgs}
        adapterStatus={status}
        defaultFlags={props.defaultFlags}
        shouldDeferAdapterConfiguration={props.shouldDeferAdapterConfiguration}
        onFlagsStateChange={handleUpdateFlags}
        onStatusStateChange={handleUpdateStatus}
      >
        {props.children}
      </ConfigureAdapter>
    </FlagsContext.Provider>
  );
};

Configure.displayName = 'ConfigureFlopflip';
Configure.defaultProps = {
  defaultFlags: {},
  shouldDeferAdapterConfiguration: false,
};

export default Configure;
