import type {
  TAdapter,
  TFlags,
  TAdapterStatus,
  TFlagsChange,
  TAdapterStatusChange,
  TConfigureAdapterChildren,
  TConfigureAdapterProps,
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
type State = {
  flags: TFlags;
  status: TAdapterStatus;
};

const initialAdapterStatus: State['status'] = {
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
};
const getInitialFlags = () => ({})

const useFlagsState = (): [
  TFlags,
  React.Dispatch<React.SetStateAction<TFlags>>
] => {
  const [flags, setFlags] = React.useState<State['flags']>(
    getInitialFlags()
  );

  return [flags, setFlags];
};

const useStatusState = (): [
  TAdapterStatus,
  React.Dispatch<React.SetStateAction<TAdapterStatus>>
] => {
  const [status, setStatus] = React.useState<State['status']>(
    initialAdapterStatus
  );

  return [status, setStatus];
};

const Configure = <AdapterInstance extends TAdapter>(
  props: Props<AdapterInstance>
) => {
  const [flags, setFlags] = useFlagsState();
  const [status, setStatus] = useStatusState();


  // NOTE:
  //   Using this prevents the callbacks being invoked
  //   which would trigger a setState as a result on an unmounted
  //   component.
  const getHasAdapterSubscriptionStatus = useAdapterSubscription(props.adapter);

  const handleUpdateFlags = React.useCallback<(flagsChange: TFlagsChange) => void>(
    (flagsChange) => {
      if (
        getHasAdapterSubscriptionStatus(AdapterSubscriptionStatus.Unsubscribed)
      ) {
        return;
      }

      setFlags((prevFlags) => ({
        ...prevFlags,
        ...flagsChange.flags,
      }));
    },
    [setFlags, getHasAdapterSubscriptionStatus]
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
