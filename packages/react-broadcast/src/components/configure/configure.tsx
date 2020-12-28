import type {
  TAdapter,
  TFlags,
  TAdapterStatus,
  TFlagsChange,
  TAdapterStatusChange,
  TConfigureAdapterChildren,
  TConfigureAdapterProps,
  TAdapterIdentifiers,
} from '@flopflip/types';
import {
  AdapterConfigurationStatus,
  AdapterSubscriptionStatus,
} from '@flopflip/types';

import React from 'react';
import { ConfigureAdapter, useAdapterSubscription } from '@flopflip/react';
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

type TGetInitialFlagsOptions = {
  adapterIdentifiers: TAdapterIdentifiers[];
};
const getInitialFlags = ({
  adapterIdentifiers,
}: TGetInitialFlagsOptions): TState['flags'] =>
  Object.fromEntries(
    adapterIdentifiers.map((adapterInterfaceIdentifier) => [
      adapterInterfaceIdentifier,
      {},
    ])
  );

type TUseFlagsStateOptions = {
  adapterIdentifiers: TAdapterIdentifiers[];
};
type TFlagUpdateFunction = (flagsChange: TFlagsChange) => void;
const useFlagsState = ({
  adapterIdentifiers,
}: TUseFlagsStateOptions): [TFlagsState, TFlagUpdateFunction] => {
  const [flags, setFlags] = React.useState<TState['flags']>(
    getInitialFlags({ adapterIdentifiers })
  );

  const updateFlags = (flagsChange: TFlagsChange) => {
    setFlags((prevState) => {
      if (flagsChange.id) {
        return {
          ...prevState,
          [flagsChange.id]: {
            ...prevState[flagsChange.id],
            ...flagsChange.flags,
          },
        };
      }

      return {
        ...prevState,
        ...Object.fromEntries(
          adapterIdentifiers.map((adapterInterfaceIdentifier) => [
            adapterInterfaceIdentifier,
            {
              ...prevState[adapterInterfaceIdentifier],
              ...flagsChange.flags,
            },
          ])
        )
      };
    });
  };

  return [flags, updateFlags];
};

const useStatusState = (): [
  TAdapterStatus,
  React.Dispatch<React.SetStateAction<TAdapterStatus>>
] => {
  const [status, setStatus] = React.useState<TState['status']>(
    initialAdapterStatus
  );

  return [status, setStatus];
};

const Configure = <AdapterInstance extends TAdapter>(
  props: Props<AdapterInstance>
) => {
  const adapterIdentifiers = [props.adapter.id];
  const [flags, updateFlags] = useFlagsState({ adapterIdentifiers });
  const [status, setStatus] = useStatusState();

  // NOTE:
  //   Using this prevents the callbacks being invoked
  //   which would trigger a setState as a result on an unmounted
  //   component.
  const getHasAdapterSubscriptionStatus = useAdapterSubscription(props.adapter);

  const handleUpdateFlags = React.useCallback<
    (flagsChange: TFlagsChange) => void
  >(
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

  const handleUpdateStatus = React.useCallback<
    (statusChange: TAdapterStatusChange) => void
  >(
    (statusChange) => {
      if (
        getHasAdapterSubscriptionStatus(AdapterSubscriptionStatus.Unsubscribed)
      ) {
        return;
      }

      setStatus((prevStatus) => ({
        ...prevStatus,
        ...statusChange.status,
      }));
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
};

Configure.displayName = 'ConfigureFlopflip';
Configure.defaultProps = {
  defaultFlags: {},
  shouldDeferAdapterConfiguration: false,
};

export default Configure;
