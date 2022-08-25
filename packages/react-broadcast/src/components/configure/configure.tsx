import { ConfigureAdapter, useAdapterSubscription } from '@flopflip/react';
import {
  type TAdapter,
  type TAdapterIdentifiers,
  type TAdapterStatus,
  type TAdapterStatusChange,
  type TConfigureAdapterChildren,
  type TConfigureAdapterProps,
  type TFlags,
  type TFlagsChange,
  AdapterConfigurationStatus,
  AdapterSubscriptionStatus,
} from '@flopflip/types';
import React, { useCallback, useMemo } from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

import { createStore } from '../../store';
import { FlagsContext } from '../flags-context';

type BaseProps = {
  children?: TConfigureAdapterChildren;
  shouldDeferAdapterConfiguration?: boolean;
  defaultFlags?: TFlags;
};
type Props<AdapterInstance extends TAdapter> = BaseProps &
  TConfigureAdapterProps<AdapterInstance>;
type TFlagsState = Record<TAdapterIdentifiers, TFlags>;
type TState = {
  flags: TFlagsState;
  status: TAdapterStatus;
};

const initialAdapterStatus: TState['status'] = {
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
};
const store = createStore<TState>({
  status: initialAdapterStatus,
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
        let nextState;
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

const useStatusState = (): [
  TAdapterStatus,
  (nextStatus: Partial<TAdapterStatus>) => void
] => {
  const status = useSyncExternalStore(
    store.subscribe,
    () => store.getSnapshot().status,
    () => store.getSnapshot().status
  );

  const setStatus = useCallback((nextStatus: Partial<TAdapterStatus>) => {
    store.setState((prevState) => ({
      ...prevState,
      status: {
        ...prevState.status,
        ...nextStatus,
      },
    }));
  }, []);

  return [status, setStatus];
};

function Configure<AdapterInstance extends TAdapter>(
  props: Props<AdapterInstance>
) {
  const adapterIdentifiers = useMemo(
    () => [props.adapter.id],
    [props.adapter.id]
  );

  const [flags, updateFlags] = useFlagsState({ adapterIdentifiers });
  const [status, setStatus] = useStatusState();

  // NOTE:
  //   Using this prevents the callbacks being invoked
  //   which would trigger a setState as a result on an unmounted
  //   component.
  const getHasAdapterSubscriptionStatus = useAdapterSubscription(props.adapter);

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

      setStatus(statusChange.status);
    },
    [setStatus, getHasAdapterSubscriptionStatus]
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
}

Configure.displayName = 'ConfigureFlopflip';
Configure.defaultProps = {
  defaultFlags: {},
  shouldDeferAdapterConfiguration: false,
};

export default Configure;
