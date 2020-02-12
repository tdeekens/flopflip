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

function useRefCachedState<S>(initialState: S): [S, (nextState: S) => void] {
  const isMounted = useIsMounted();
  const stateRef = React.useRef<S>();
  const [state, setState] = React.useState<S>(initialState);

  const setRefCachedState = (nextState: S) => {
    if (isMounted()) {
      setState(prevState => ({
        ...prevState,
        ...nextState,
        ...stateRef.current,
      }));
      stateRef.current = undefined;
    } else {
      stateRef.current = {
        ...stateRef.current,
        ...nextState,
      };
    }
  };

  return [state, setRefCachedState];
}

const Configure = <AdapterInstance extends TAdapter>(
  props: Props<AdapterInstance>
) => {
  const [flags, setFlags] = useRefCachedState<State['flags']>({});
  const [status, setStatus] = useRefCachedState<State['status']>({});

  const handleUpdateFlags = React.useCallback(
    (flags: TFlags) => {
      setFlags(flags);
    },
    [setFlags]
  );

  const handleUpdateStatus = React.useCallback(
    (status: TAdapterStatus) => {
      setStatus(status);
    },
    [setStatus]
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
