import {
  TFlags,
  TAdapter,
  TAdapterInterface,
  TAdapterArgs,
  TAdapterStatus,
  TAdapterReconfiguration,
  TAdapterConfigurationStatus,
  TAdapterReconfigurationOptions,
  TConfigureAdapterChildren,
  TAdapterStatusChange,
  TFlagsChange,
} from '@flopflip/types';
import React from 'react';
import {
  isFunctionChildren,
  isEmptyChildren,
  mergeAdapterArgs,
} from './helpers';
import AdapterContext, { createAdapterContext } from '../adapter-context';

type ValueOf<T> = T[keyof T];

export const AdapterStates = {
  UNCONFIGURED: 'unconfigured',
  CONFIGURING: 'configuring',
  CONFIGURED: 'configured',
} as const;
export type TAdapterStates = ValueOf<typeof AdapterStates>;

type TProps = {
  shouldDeferAdapterConfiguration?: boolean;
  adapter: TAdapter;
  adapterArgs: TAdapterArgs;
  adapterStatus?: TAdapterStatus;
  defaultFlags?: TFlags;
  onFlagsStateChange: (flags: TFlagsChange) => void;
  onStatusStateChange: (status: TAdapterStatusChange) => void;
  render?: () => React.ReactNode;
  children?: TConfigureAdapterChildren;
};

const useAppliedAdapterArgsState = ({
  initialAdapterArgs,
}: {
  initialAdapterArgs: TAdapterArgs;
}): [TAdapterArgs, (nextAdapterArgs: TAdapterArgs) => void] => {
  const [appliedAdapterArgs, setAppliedAdapterArgs] = React.useState<
    TAdapterArgs
  >(initialAdapterArgs);

  const applyAdapterArgs = React.useCallback(
    (nextAdapterArgs: TAdapterArgs) => {
      /**
       * NOTE:
       *   We can only unset `pendingAdapterArgs` after we actually perform
       *   a batched `setState` otherwise outdated `adapterArgs` as we loose
       *   the `pendingAdapterArgs` as we unset them too early.
       */
      setAppliedAdapterArgs(nextAdapterArgs);
    },
    [setAppliedAdapterArgs]
  );

  return [appliedAdapterArgs, applyAdapterArgs];
};

const usePendingAdapterArgsRef = () => {
  const pendingAdapterArgsRef = React.useRef<TAdapterArgs | null>(null);

  return pendingAdapterArgsRef;
};

const useAdapterStateRef = () => {
  const adapterStateRef = React.useRef<TAdapterStates>(
    AdapterStates.UNCONFIGURED
  );

  return adapterStateRef;
};

const ConfigureAdapter = (props: TProps) => {
  const [appliedAdapterArgs, applyAdapterArgs] = useAppliedAdapterArgsState({
    initialAdapterArgs: props.adapterArgs,
  });
  const pendingAdapterArgs = usePendingAdapterArgsRef();
  const adapterState = useAdapterStateRef();

  const setAdapterState = React.useCallback(
    (nextAdapterState: TAdapterStates) => {
      adapterState.current = nextAdapterState;
    },
    [adapterState]
  );

  /**
   * NOTE:
   *   Clears the pending adapter args when applied adapter
   *   args were set. Previously achieved via `setState` callback.
   */
  React.useEffect(() => {
    pendingAdapterArgs.current = null;
  }, [appliedAdapterArgs, pendingAdapterArgs]);

  const getIsAdapterConfigured = React.useCallback(
    () => adapterState.current === AdapterStates.CONFIGURED,
    [adapterState]
  );

  const getDoesAdapterNeedInitialConfiguration = React.useCallback(
    () =>
      adapterState.current !== AdapterStates.CONFIGURED &&
      adapterState.current !== AdapterStates.CONFIGURING,
    [adapterState]
  );

  const setPendingAdapterArgs = React.useCallback(
    (nextReconfiguration: TAdapterReconfiguration): void => {
      /**
       * NOTE:
       *    The next reconfiguration is merged into the previous
       *    one instead of maintaining a queue.
       *
       *    The first merge is merged with `appliedAdapter` args
       *    to contain the initial state (through property initializer).
       */
      pendingAdapterArgs.current = mergeAdapterArgs(
        pendingAdapterArgs.current ?? appliedAdapterArgs,
        nextReconfiguration
      );
    },
    [appliedAdapterArgs, pendingAdapterArgs]
  );

  /**
   * NOTE:
   *   This is passed through the React context (it's a public API).
   *   Internally this component has a `ReconfigureAdapter` type;
   *   this function has two arguments for clarify.
   */
  const reconfigureOrQueue = React.useCallback(
    (
      nextAdapterArgs: TAdapterArgs,
      options: TAdapterReconfigurationOptions
    ): void => {
      if (getIsAdapterConfigured()) {
        applyAdapterArgs(
          mergeAdapterArgs(appliedAdapterArgs, {
            adapterArgs: nextAdapterArgs,
            options,
          })
        );
        return;
      }

      setPendingAdapterArgs({ adapterArgs: nextAdapterArgs, options });
    },
    [
      appliedAdapterArgs,
      applyAdapterArgs,
      getIsAdapterConfigured,
      setPendingAdapterArgs,
    ]
  );

  /**
   * NOTE:
   *    Whenever the adapter delays configuration pending adapterArgs will
   *    be kept on `pendingAdapterArgs`. These can either be populated
   *    from calls to `UNSAFE_componentWillReceiveProps` or through `ReconfigureFlopflip`.
   *    Both cases go through `reconfigureOrQueue`.
   *
   *    In any case, when the adapter should be configured it should either
   *    be passed pending or applied adapterArgs.
   *
   */
  const getAdapterArgsForConfiguration = React.useCallback(
    (): TAdapterArgs => pendingAdapterArgs.current ?? appliedAdapterArgs,
    [appliedAdapterArgs, pendingAdapterArgs]
  );

  const onFlagsStateChange = props.onFlagsStateChange;
  const handleDefaultFlags = React.useCallback(
    (defaultFlags: TFlags): void => {
      if (Object.keys(defaultFlags).length > 0) {
        onFlagsStateChange(defaultFlags);
      }
    },
    [onFlagsStateChange]
  );

  // NOTE: This should only happen once when component mounted
  React.useEffect(() => {
    if (props.defaultFlags) handleDefaultFlags(props.defaultFlags);

    if (!props.shouldDeferAdapterConfiguration) {
      setAdapterState(AdapterStates.CONFIGURING);

      (props.adapter as TAdapterInterface<TAdapterArgs>)
        .configure(getAdapterArgsForConfiguration(), {
          onFlagsStateChange: props.onFlagsStateChange,
          onStatusStateChange: props.onStatusStateChange,
        })
        .then(() => {
          setAdapterState(AdapterStates.CONFIGURED);
          if (pendingAdapterArgs.current) {
            applyAdapterArgs(pendingAdapterArgs.current);
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const adapterArgs = props.adapterArgs;
  React.useEffect(() => {
    /**
     * NOTE:
     *   The component might receive `adapterArgs` from `ReconfigureFlopflip`
     *   before it managed to configure. If that occurs the next `adapterArgs`
     *   passed in will overwrite what `ReconfigureFlopflip` passed in before
     *   yielding a loss in configuration.
     *
     *   However, when the adapter is configured we want the component to
     *   act in a controlled manner so that overwriting will occur when the
     *   passed `adapterArgs` change.
     */
    reconfigureOrQueue(adapterArgs, {
      shouldOverwrite: adapterState.current === AdapterStates.CONFIGURED,
    });
  }, [adapterArgs, adapterState, reconfigureOrQueue]);

  const {
    adapter,
    onStatusStateChange,
    shouldDeferAdapterConfiguration,
  } = props;
  React.useEffect(() => {
    if (
      !shouldDeferAdapterConfiguration &&
      getDoesAdapterNeedInitialConfiguration()
    ) {
      setAdapterState(AdapterStates.CONFIGURING);

      (adapter as TAdapterInterface<TAdapterArgs>)
        .configure(getAdapterArgsForConfiguration(), {
          onFlagsStateChange,
          onStatusStateChange,
        })
        .then(() => {
          setAdapterState(AdapterStates.CONFIGURED);

          if (pendingAdapterArgs.current) {
            applyAdapterArgs(pendingAdapterArgs.current);
          }
        });
      return;
    }

    if (getIsAdapterConfigured()) {
      setAdapterState(AdapterStates.CONFIGURING);

      (adapter as TAdapterInterface<TAdapterArgs>)
        .reconfigure(getAdapterArgsForConfiguration(), {
          onFlagsStateChange,
          onStatusStateChange,
        })
        .then(() => {
          setAdapterState(AdapterStates.CONFIGURED);
        });
    }
  }, [
    applyAdapterArgs,
    getAdapterArgsForConfiguration,
    getDoesAdapterNeedInitialConfiguration,
    getIsAdapterConfigured,
    setAdapterState,
    pendingAdapterArgs,
    // From props
    adapter,
    onFlagsStateChange,
    onStatusStateChange,
    shouldDeferAdapterConfiguration,
  ]);

  return (
    <AdapterContext.Provider
      value={createAdapterContext(reconfigureOrQueue, props.adapterStatus)}
    >
      {(() => {
        const isAdapterConfigured = props.adapter.getIsConfigurationStatus(
          TAdapterConfigurationStatus.Configured
        );

        if (isAdapterConfigured) {
          if (typeof props.render === 'function') return props.render();
        }

        if (isFunctionChildren(props.children))
          return props.children({
            // NOTE: Deprecated, please use `isAdapterConfigured`.
            isAdapterReady: isAdapterConfigured,
            isAdapterConfigured,
          });

        if (props.children && !isEmptyChildren(props.children))
          return React.Children.only<React.ReactNode>(props.children);

        return null;
      })()}
    </AdapterContext.Provider>
  );
};

ConfigureAdapter.defaultProps = {
  shouldDeferAdapterConfiguration: false,
  defaultFlags: {},
  children: null,
  render: null,
};
ConfigureAdapter.displayName = 'ConfigureAdapter';

export default ConfigureAdapter;
