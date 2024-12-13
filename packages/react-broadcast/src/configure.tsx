import { ConfigureAdapter, useAdapterSubscription } from '@flopflip/react';
import {
  AdapterSubscriptionStatus,
  type TAdapter,
  type TAdapterIdentifiers,
  type TAdapterStatusChange,
  type TAdaptersStatus,
  type TConfigureAdapterChildren,
  type TConfigureAdapterProps,
  type TFlags,
  type TFlagsChange,
} from '@flopflip/types';
import React, { useCallback, useMemo } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

import { FlagsContext } from './flags-context';
import { createStore } from './store';

type BaseProps = {
  readonly children?: TConfigureAdapterChildren;
  readonly shouldDeferAdapterConfiguration?: boolean;
  readonly defaultFlags?: TFlags;
};
type TProps<AdapterInstance extends TAdapter> = BaseProps &
  TConfigureAdapterProps<AdapterInstance>;
type TFlagsState = Record<TAdapterIdentifiers, TFlags>;
type TState = {
  flags: TFlagsState;
  status: TAdaptersStatus;
};

const store = createStore<TState>({
  status: {},
  flags: {},
});

type TUseFlagsStateOptions = {
  adapterIdentifiers: TAdapterIdentifiers[];
};
type TFlagUpdateFunction = (flagsChange: TFlagsChange) => void;
const useFlagsState = ({
  adapterIdentifiers,
}: TUseFlagsStateOptions): [TFlagsState, TFlagUpdateFunction] => {
  const flags = useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot().flags,
    () => store.getSnapshot().flags
  );

  const updateFlags = useCallback(
    (flagsChange: TFlagsChange) => {
      store.setState((prevState) => {
        let nextState: TState;
        if (flagsChange.id) {
          nextState = {
            ...prevState,
            flags: {
              ...prevState.flags,
              [flagsChange.id]: {
                ...prevState.flags[flagsChange.id],
                ...flagsChange.flags,
              },
            },
          };

          return nextState;
        }

        nextState = {
          ...prevState,
          flags: {
            ...prevState.flags,
            ...Object.fromEntries(
              adapterIdentifiers.map((adapterInterfaceIdentifier) => [
                adapterInterfaceIdentifier,
                {
                  ...prevState.flags[adapterInterfaceIdentifier],
                  ...flagsChange.flags,
                },
              ])
            ),
          },
        };

        return nextState;
      });
    },
    [adapterIdentifiers]
  );

  return [flags, updateFlags];
};

type TUseStatusStateOptions = {
  adapterIdentifiers: TAdapterIdentifiers[];
};
type TStatusUpdateFunction = (statusChange: TAdapterStatusChange) => void;
const useStatusState = ({
  adapterIdentifiers,
}: TUseStatusStateOptions): [TAdaptersStatus, TStatusUpdateFunction] => {
  const status = useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot().status,
    () => store.getSnapshot().status
  );

  const setStatus = useCallback(
    (statusChange: TAdapterStatusChange) => {
      store.setState((prevState) => {
        let nextState: TState;

        if (statusChange.id) {
          nextState = {
            ...prevState,
            status: {
              ...prevState.status,
              [statusChange.id]: {
                ...prevState.status[statusChange.id],
                ...statusChange.status,
              },
            },
          };

          return nextState;
        }

        nextState = {
          ...prevState,
          status: {
            ...prevState.status,
            ...Object.fromEntries(
              adapterIdentifiers.map((adapterInterfaceIdentifier) => [
                adapterInterfaceIdentifier,
                {
                  ...prevState.status[adapterInterfaceIdentifier],
                  ...statusChange.status,
                },
              ])
            ),
          },
        };

        return nextState;
      });
    },
    [adapterIdentifiers]
  );

  return [status, setStatus];
};

function Configure<AdapterInstance extends TAdapter>({
  children,
  shouldDeferAdapterConfiguration = false,
  defaultFlags = {},
  adapter,
  adapterArgs,
}: TProps<AdapterInstance>) {
  const adapterIdentifiers = useMemo(() => [adapter.id], [adapter.id]);

  const [flags, updateFlags] = useFlagsState({ adapterIdentifiers });
  const [status, updateStatus] = useStatusState({ adapterIdentifiers });
  // NOTE:
  //   Using this prevents the callbacks being invoked
  //   which would trigger a setState as a result on an unmounted
  //   component.
  const getHasAdapterSubscriptionStatus = useAdapterSubscription(adapter);

  const handleUpdateFlags = useCallback<(flagsChange: TFlagsChange) => void>(
    (flagsChange) => {
      if (
        getHasAdapterSubscriptionStatus(AdapterSubscriptionStatus.Unsubscribed)
      ) {
        return;
      }

      updateFlags(flagsChange);
    },
    [updateFlags, getHasAdapterSubscriptionStatus]
  );

  const handleUpdateStatus = useCallback<
    (statusChange: TAdapterStatusChange) => void
  >(
    (statusChange) => {
      if (
        getHasAdapterSubscriptionStatus(AdapterSubscriptionStatus.Unsubscribed)
      ) {
        return;
      }

      updateStatus(statusChange);
    },
    [updateStatus, getHasAdapterSubscriptionStatus]
  );

  return (
    <FlagsContext.Provider value={flags}>
      <ConfigureAdapter
        adapter={adapter}
        adapterArgs={adapterArgs}
        adapterStatus={status}
        defaultFlags={defaultFlags}
        shouldDeferAdapterConfiguration={shouldDeferAdapterConfiguration}
        onFlagsStateChange={handleUpdateFlags}
        onStatusStateChange={handleUpdateStatus}
      >
        {children}
      </ConfigureAdapter>
    </FlagsContext.Provider>
  );
}

Configure.displayName = 'ConfigureFlopflip';

export { Configure };
