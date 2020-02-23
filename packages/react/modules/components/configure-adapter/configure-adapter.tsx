import React from 'react';
import {
  TFlags,
  TAdapter,
  TAdapterInterface,
  TAdapterArgs,
  TAdapterStatus,
  TAdapterReconfiguration,
  TAdapterReconfigurationOptions,
  TConfigureAdapterChildren,
  TAdapterStatusChange,
  TFlagsChange,
} from '@flopflip/types';
import {
  isFunctionChildren,
  isEmptyChildren,
  mergeAdapterArgs,
} from './helpers';
import AdapterContext, { createAdapterContext } from '../adapter-context';

type valueOf<T> = T[keyof T];

type TAdapterStates = {
  UNCONFIGURED: string;
  CONFIGURING: string;
  CONFIGURED: string;
};
export const AdapterStates: TAdapterStates = {
  UNCONFIGURED: 'unconfigured',
  CONFIGURING: 'configuring',
  CONFIGURED: 'configured',
};

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
type TAdapterState = valueOf<TAdapterStates>;

const ConfigureAdapter = (props: TProps) => {
  const [appliedAdapterArgs, setAppliedAdapterArgs] = React.useState<
    TAdapterArgs
  >(props.adapterArgs);
  const pendingAdapterArgs = React.useRef<TAdapterArgs | null>(null);
  const adapterState = React.useRef<TAdapterState>(AdapterStates.UNCONFIGURED);

  const setAdapterState = React.useCallback(
    (nextAdapterState: TAdapterState) => {
      adapterState.current = nextAdapterState;
    },
    [adapterState]
  );

  React.useEffect(() => {
    pendingAdapterArgs.current = null;
  }, [appliedAdapterArgs]);

  const applyAdapterArgs = React.useCallback(
    (nextAdapterArgs: TAdapterArgs) => {
      /**
       * NOTE:
       *   We can only unset `pendingAdapterArgs` after be actually perform
       *   a batched `setState` otherwise outdated `adapterArgs` as we loose
       *   the `pendingAdapterArgs` as we unset them too early.
       */
      setAppliedAdapterArgs(nextAdapterArgs);
    },
    []
  );

  const getIsAdapterConfigured = React.useCallback(
    () =>
      adapterState.current === AdapterStates.CONFIGURED &&
      adapterState.current !== AdapterStates.CONFIGURING,
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
       *    The first merge with merge with `appliedAdapter` args
       *    to contain the initial state (through property initializer).
       */
      pendingAdapterArgs.current = mergeAdapterArgs(
        pendingAdapterArgs.current ?? appliedAdapterArgs,
        nextReconfiguration
      );
    },
    [appliedAdapterArgs]
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
    ): void =>
      getIsAdapterConfigured()
        ? applyAdapterArgs(
            mergeAdapterArgs(appliedAdapterArgs, {
              adapterArgs: nextAdapterArgs,
              options,
            })
          )
        : setPendingAdapterArgs({ adapterArgs: nextAdapterArgs, options }),
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
    [appliedAdapterArgs]
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
    // NOTE: This should only happen once when component mounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * NOTE:
   *   This should be UNSAFE_componentWillReceiveProps.
   *   However to maintain compatibility with older and newer versions of React
   *   this can not be prefixed with UNSAFE_.
   *
   *   For the future this should likely happen in cDU however as `reconfigureOrQueue`
   *   may trigger a `setState` it might have unexpected side-effects (setState-loop).
   *   Maybe some more substancial refactor would be needed.
   */
  const adapterArgs = props.adapterArgs;
  React.useEffect(() => {
    /**
     * NOTE:
     *   The component might receive `adapterArgs` from `ReconfigureFlopflip`
     *   before it managed to configure. If that occurs the next `adapterArgs`
     *   passed in will overwrite what `ReconfigureFlopflip` passed in before
     *   yieling a loss in configuration.
     *
     *   Whenever however the adapter has configured we want to component to
     *   act in a controleld manner. So that overwriting will occur when the
     *   passed `adapterArgs` change.
     */
    reconfigureOrQueue(adapterArgs, {
      shouldOverwrite: adapterState.current === AdapterStates.CONFIGURED,
    });
  }, [adapterArgs, reconfigureOrQueue]);

  React.useEffect(() => {
    /**
     * NOTE:
     *   Be careful here to not double configure from `componentDidMount`.
     *   Moreover, cDU will also be invoked from `setState` to `appliedAdapterArgs`.
     *   Hence, avoid calling `setState` within cDU.
     */

    if (
      !props.shouldDeferAdapterConfiguration &&
      getDoesAdapterNeedInitialConfiguration()
    ) {
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
      return;
    }

    if (getIsAdapterConfigured()) {
      setAdapterState(AdapterStates.CONFIGURING);

      (props.adapter as TAdapterInterface<TAdapterArgs>)
        .reconfigure(getAdapterArgsForConfiguration(), {
          onFlagsStateChange: props.onFlagsStateChange,
          onStatusStateChange: props.onStatusStateChange,
        })
        .then(() => {
          setAdapterState(AdapterStates.CONFIGURED);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  return (
    <AdapterContext.Provider
      value={createAdapterContext(reconfigureOrQueue, props.adapterStatus)}
    >
      {(() => {
        const isAdapterReady = props.adapter.getIsReady();

        if (isAdapterReady) {
          if (typeof props.render === 'function') return props.render();
        }

        if (isFunctionChildren(props.children))
          return props.children({
            isAdapterReady,
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
