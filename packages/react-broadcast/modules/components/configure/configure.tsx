import React from 'react';
import {
  TAdapter,
  TFlags,
  TAdapterStatus,
  TFlagsChange,
  TAdapterStatusChange,
  TConfigureAdapterChildren,
  TConfigureAdapterProps,
  TAdapterConfigurationStatus,
  TAdapterSubscriptionStatus,
} from '@flopflip/types';
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
  configurationId?: string;
};

const initialAdapterStatus: State['status'] = {
  subscriptionStatus: TAdapterSubscriptionStatus.Subscribed,
  configurationStatus: TAdapterConfigurationStatus.Unconfigured,
};
const initialFlags: State['flags'] = {};

const useFlagsState = ({ initialFlags }: { initialFlags: State['flags'] }) => {
  const [flags, setFlags] = React.useState<State['flags']>(initialFlags);

  React.useDebugValue({
    flags,
  });

  return [flags, setFlags];
};

const useStatusState = ({
  initialAdapterStatus,
}: {
  initialAdapterStatus: State['status'];
}) => {
  const [status, setStatus] = React.useState<State['status']>(
    initialAdapterStatus
  );

  React.useDebugValue({
    status,
  });

  return [status, setStatus];
};

const Configure = <AdapterInstance extends TAdapter>(
  props: Props<AdapterInstance>
) => {
  const [flags, setFlags] = useFlagsState({ initialFlags });
  const [status, setStatus] = useStatusState({ initialAdapterStatus });

  // NOTE:
  //   Using this prevents the callbacks being invoked
  //   which would trigger a setState as a result on an unmounted
  //   component.
  const getHasAdapterSubscriptionStatus = useAdapterSubscription(props.adapter);

  const handleUpdateFlags = React.useCallback<(flags: TFlagsChange) => void>(
    flags => {
      if (
        getHasAdapterSubscriptionStatus(TAdapterSubscriptionStatus.Unsubscribed)
      ) {
        return;
      }

      setFlags(prevFlags => ({
        ...prevFlags,
        ...flags,
      }));
    },
    [setFlags, getHasAdapterSubscriptionStatus]
  );

  const handleUpdateStatus = React.useCallback<
    (status: TAdapterStatusChange) => void
  >(
    status => {
      if (
        getHasAdapterSubscriptionStatus(TAdapterSubscriptionStatus.Unsubscribed)
      ) {
        return;
      }

      setStatus(prevStatus => ({
        ...prevStatus,
        ...status,
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
