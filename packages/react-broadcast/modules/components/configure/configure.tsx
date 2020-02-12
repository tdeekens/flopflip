import React from 'react';
import { ConfigureAdapter, useIsMounted } from '@flopflip/react';
import {
  TFlags,
  TAdapter,
  TAdapterStatus,
  TConfigureAdapterChildren,
  TConfigureAdapterProps,
} from '@flopflip/types';
import { FlagsContext } from '../flags-context';

type BaseProps = {
  children?: TConfigureAdapterChildren;
  shouldDeferAdapterConfiguration?: boolean;
  defaultFlags?: TFlags;
};
type Props<AdapterInstance extends TAdapter> = BaseProps &
  TConfigureAdapterProps<AdapterInstance>;
type State = {
  flags: TFlags;
  status: TAdapterStatus;
  configurationId?: string;
};

const Configure = <AdapterInstance extends TAdapter>(
  props: Props<AdapterInstance>
) => {
  const isMounted = useIsMounted();
  const [flags, setFlags] = React.useState<State['flags']>({});
  const [status, setStatus] = React.useState<State['status']>({});

  const handleUpdateFlags = React.useCallback(
    (flags: TFlags) => {
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
    (status: TAdapterStatus) => {
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
