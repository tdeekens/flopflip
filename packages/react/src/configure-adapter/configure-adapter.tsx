import { getAllCachedFlags } from '@flopflip/cache';
import {
  AdapterConfigurationStatus,
  type TAdapter,
  type TAdapterArgs,
  type TAdapterEventHandlers,
  type TAdapterInterface,
  type TAdapterReconfiguration,
  type TAdapterReconfigurationOptions,
  type TAdaptersStatus,
  type TConfigureAdapterChildren,
  type TFlags,
} from '@flopflip/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
  configureAdapter,
  reconfigureAdapter,
} from '../adapters/configure-adapter-utility';
import { AdapterContext, createAdapterContext } from '../adapter-context';
import {
  isEmptyChildren,
  isFunctionChildren,
  mergeAdapterArgs,
} from './helpers';

type ValueOf<T> = T[keyof T];

export const AdapterStates = {
  UNCONFIGURED: 'unconfigured',
  CONFIGURING: 'configuring',
  CONFIGURED: 'configured',
} as const;
export type TAdapterStates = ValueOf<typeof AdapterStates>;

type TProps = {
  readonly shouldDeferAdapterConfiguration?: boolean;
  readonly adapter: TAdapter;
  readonly adapterArgs: TAdapterArgs;
  readonly adapterStatus?: TAdaptersStatus;
  readonly defaultFlags?: TFlags;
  readonly onFlagsStateChange: TAdapterEventHandlers['onFlagsStateChange'];
  readonly onStatusStateChange: TAdapterEventHandlers['onStatusStateChange'];
  readonly render?: () => React.ReactNode;
  readonly children?: TConfigureAdapterChildren;
};

type TUseAppliedAdapterArgsStateOptions = {
  initialAdapterArgs: TAdapterArgs;
};
type TUseAppliedAdapterArgsStateReturn = [
  TAdapterArgs,
  (nextAdapterArgs: TAdapterArgs) => void,
];
const useAppliedAdapterArgsState = ({
  initialAdapterArgs,
}: TUseAppliedAdapterArgsStateOptions): TUseAppliedAdapterArgsStateReturn => {
  const [appliedAdapterArgs, setAppliedAdapterArgs] =
    useState<TAdapterArgs>(initialAdapterArgs);

  // biome-ignore lint/correctness/useExhaustiveDependencies: false positive
  const applyAdapterArgs = useCallback(
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

interface TUseAdapterStateRefReturn {
  readonly adapterStateRef: React.MutableRefObject<TAdapterStates>;
  readonly setAdapterState: (nextAdapterState: TAdapterStates) => void;
  readonly getIsAdapterConfigured: () => boolean;
  readonly getDoesAdapterNeedInitialConfiguration: () => boolean;
}

const useAdapterStateRef = (): TUseAdapterStateRefReturn => {
  const adapterStateRef = useRef<TAdapterStates>(AdapterStates.UNCONFIGURED);

  /**
   * We intentionally omit `adapterStateRef` from dependencies because:
   * 1. Ref object identity is stable across renders
   * 2. Including it would cause the callback to recreate unnecessarily
   * 3. The callback only reads from the ref, doesn't depend on its value
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: justified - ref identity is stable
  const setAdapterState = useCallback(
    (nextAdapterState: TAdapterStates) => {
      adapterStateRef.current = nextAdapterState;
    },
    []
  );

  /**
   * Same justification as setAdapterState - we're reading a stable ref
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: justified - ref identity is stable
  const getIsAdapterConfigured = useCallback(
    () => adapterStateRef.current === AdapterStates.CONFIGURED,
    []
  );

  /**
   * Same justification as setAdapterState and getIsAdapterConfigured
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: justified - ref identity is stable
  const getDoesAdapterNeedInitialConfiguration = useCallback(
    () =>
      adapterStateRef.current !== AdapterStates.CONFIGURED &&
      adapterStateRef.current !== AdapterStates.CONFIGURING,
    []
  );

  return {
    adapterStateRef,
    setAdapterState,
    getIsAdapterConfigured,
    getDoesAdapterNeedInitialConfiguration,
  };
};

interface TUsePendingAdapterArgsRefReturn {
  readonly pendingAdapterArgsRef: React.MutableRefObject<
    TAdapterArgs | undefined
  >;
  readonly setPendingAdapterArgs: (
    nextReconfiguration: TAdapterReconfiguration
  ) => void;
  readonly getAdapterArgsForConfiguration: () => TAdapterArgs;
}

const usePendingAdapterArgsRef = (
  appliedAdapterArgs: TAdapterArgs
): TUsePendingAdapterArgsRefReturn => {
  const pendingAdapterArgsRef = useRef<TAdapterArgs | undefined>(undefined);

  /**
   * We depend on appliedAdapterArgs to properly merge reconfigurations,
   * but we read the current value from the ref to avoid losing previous
   * pending args during transitions.
   */
  const setPendingAdapterArgs = useCallback(
    (nextReconfiguration: TAdapterReconfiguration): void => {
      /**
       * NOTE:
       *    The next reconfiguration is merged into the previous
       *    one instead of maintaining a queue.
       *
       *    The first merge is merged with `appliedAdapter` args
       *    to contain the initial state (through property initializer).
       */
      pendingAdapterArgsRef.current = mergeAdapterArgs(
        pendingAdapterArgsRef.current ?? appliedAdapterArgs,
        nextReconfiguration
      );
    },
    [appliedAdapterArgs]
  );

  /**
   * Ref identity is stable, so we don't need it in dependencies.
   */
  // biome-ignore lint/correctness/useExhaustiveDependencies: justified - ref identity is stable
  const unsetPendingAdapterArgs = useCallback(() => {
    pendingAdapterArgsRef.current = undefined;
  }, []);

  /**
   * NOTE:
   *    Whenever the adapter delays configuration pending adapterArgs will
   *    be kept on `pendingAdapterArgs`. These can either be populated
   *    from calls to `UNSAFE_componentWillReceiveProps` or through `ReconfigureFlopflip`.
   *    Both cases go through `reconfigureOrQueue`.
   *
   *    In any case, when the adapter should be configured it should either
   *    be passed pending or applied adapterArgs.
   */

  /**
   * We depend on appliedAdapterArgs to ensure we return the current applied
   * args when there are no pending args. The ref itself is stable.
   */
  const getAdapterArgsForConfiguration = useCallback(
    (): TAdapterArgs => pendingAdapterArgsRef.current ?? appliedAdapterArgs,
    [appliedAdapterArgs]
  );

  /**
   * NOTE: Clears the pending adapter args when applied adapter args changed.
   */
  useEffect(unsetPendingAdapterArgs, [
    appliedAdapterArgs,
    unsetPendingAdapterArgs,
  ]);

  return {
    pendingAdapterArgsRef,
    setPendingAdapterArgs,
    getAdapterArgsForConfiguration,
  };
};

type TUseHandleDefaultFlagsCallbackOptions = {
  onFlagsStateChange: TAdapterEventHandlers['onFlagsStateChange'];
};
const useHandleDefaultFlagsCallback = ({
  onFlagsStateChange,
}: TUseHandleDefaultFlagsCallbackOptions) => {
  const handleDefaultFlags = useCallback(
    (defaultFlags: TFlags): void => {
      if (Object.keys(defaultFlags).length > 0) {
        onFlagsStateChange({ flags: defaultFlags });
      }
    },
    [onFlagsStateChange]
  );

  return handleDefaultFlags;
};

type TUseConfigurationEffectOptions = {
  adapter: TAdapter;
  shouldDeferAdapterConfiguration: TProps['shouldDeferAdapterConfiguration'];
  getDoesAdapterNeedInitialConfiguration: TUseAdapterStateRefReturn['getDoesAdapterNeedInitialConfiguration'];
  setAdapterState: TUseAdapterStateRefReturn['setAdapterState'];
  onFlagsStateChange: TAdapterEventHandlers['onFlagsStateChange'];
  onStatusStateChange: TAdapterEventHandlers['onStatusStateChange'];
  applyAdapterArgs: TUseAppliedAdapterArgsStateReturn['1'];
  getAdapterArgsForConfiguration: TUsePendingAdapterArgsRefReturn['getAdapterArgsForConfiguration'];
  getIsAdapterConfigured: TUseAdapterStateRefReturn['getIsAdapterConfigured'];
  pendingAdapterArgsRef: TUsePendingAdapterArgsRefReturn['pendingAdapterArgsRef'];
  appliedAdapterArgs: TAdapterArgs;
};

const useConfigurationEffect = ({
  adapter,
  shouldDeferAdapterConfiguration,
  getDoesAdapterNeedInitialConfiguration,
  setAdapterState,
  onFlagsStateChange,
  onStatusStateChange,
  applyAdapterArgs,
  getAdapterArgsForConfiguration,
  getIsAdapterConfigured,
  pendingAdapterArgsRef,
  appliedAdapterArgs,
}: TUseConfigurationEffectOptions) => {
  /**
   * We depend on all parameters to ensure effect runs when any value changes,
   * but we read current values from callbacks/refs to avoid stale closures.
   */
  useEffect(() => {
    if (
      !shouldDeferAdapterConfiguration &&
      getDoesAdapterNeedInitialConfiguration()
    ) {
      setAdapterState(AdapterStates.CONFIGURING);

      configureAdapter(
        adapter as TAdapterInterface<TAdapterArgs>,
        getAdapterArgsForConfiguration(),
        {
          onFlagsStateChange,
          onStatusStateChange,
        }
      ).then((result) => {
        if (result.wasInitializationSuccessful) {
          setAdapterState(AdapterStates.CONFIGURED);

          if (pendingAdapterArgsRef.current) {
            applyAdapterArgs(pendingAdapterArgsRef.current);
          }
        }
      });
    }

    if (getIsAdapterConfigured()) {
      setAdapterState(AdapterStates.CONFIGURING);

      reconfigureAdapter(
        adapter as TAdapterInterface<TAdapterArgs>,
        getAdapterArgsForConfiguration(),
        {
          onFlagsStateChange,
          onStatusStateChange,
        }
      ).then((result) => {
        if (result.wasInitializationSuccessful) {
          setAdapterState(AdapterStates.CONFIGURED);
        }
      });
    }
  }, [
    adapter,
    shouldDeferAdapterConfiguration,
    onFlagsStateChange,
    onStatusStateChange,
    applyAdapterArgs,
    getAdapterArgsForConfiguration,
    getDoesAdapterNeedInitialConfiguration,
    getIsAdapterConfigured,
    setAdapterState,
    pendingAdapterArgsRef,
    appliedAdapterArgs,
  ]);
};

type TUseDefaultFlagsEffectOptions = {
  adapter: TAdapter;
  defaultFlags?: TFlags;
  onFlagsStateChange: TAdapterEventHandlers['onFlagsStateChange'];
  onStatusStateChange: TAdapterEventHandlers['onStatusStateChange'];
  setAdapterState: TUseAdapterStateRefReturn['setAdapterState'];
  pendingAdapterArgsRef: TUsePendingAdapterArgsRefReturn['pendingAdapterArgsRef'];
  shouldDeferAdapterConfiguration: TProps['shouldDeferAdapterConfiguration'];
  applyAdapterArgs: TUseAppliedAdapterArgsStateReturn['1'];
  getAdapterArgsForConfiguration: TUsePendingAdapterArgsRefReturn['getAdapterArgsForConfiguration'];
};

const useDefaultFlagsEffect = ({
  adapter,
  defaultFlags,
  onFlagsStateChange,
  onStatusStateChange,
  setAdapterState,
  pendingAdapterArgsRef,
  shouldDeferAdapterConfiguration,
  applyAdapterArgs,
  getAdapterArgsForConfiguration,
}: TUseDefaultFlagsEffectOptions) => {
  const handleDefaultFlags = useHandleDefaultFlagsCallback({
    onFlagsStateChange,
  });

  /**
   * This effect runs only once on mount (empty dependency array).
   * We capture the current values through closures from parameters.
   */
  useEffect(() => {
    if (defaultFlags) {
      handleDefaultFlags(defaultFlags);
    }

    if (!shouldDeferAdapterConfiguration) {
      setAdapterState(AdapterStates.CONFIGURING);

      configureAdapter(
        adapter as TAdapterInterface<TAdapterArgs>,
        getAdapterArgsForConfiguration(),
        {
          onFlagsStateChange,
          onStatusStateChange,
        }
      ).then((result) => {
        if (result.wasInitializationSuccessful) {
          setAdapterState(AdapterStates.CONFIGURED);

          if (pendingAdapterArgsRef.current) {
            applyAdapterArgs(pendingAdapterArgsRef.current);
          }
        }
      });
    }
  }, []);
};

type TUsePendingAdapterArgsEffectOptions = {
  adapterArgs: TAdapterArgs;
  appliedAdapterArgs: TAdapterArgs;
  applyAdapterArgs: TUseAppliedAdapterArgsStateReturn['1'];
  getIsAdapterConfigured: TUseAdapterStateRefReturn['getIsAdapterConfigured'];
  setPendingAdapterArgs: TUsePendingAdapterArgsRefReturn['setPendingAdapterArgs'];
};

const usePendingAdapterArgsEffect = ({
  adapterArgs,
  appliedAdapterArgs,
  applyAdapterArgs,
  getIsAdapterConfigured,
  setPendingAdapterArgs,
}: TUsePendingAdapterArgsEffectOptions) => {
  /**
   * NOTE:
   *   This is passed through the React context (it's a public API).
   *   Internally this component has a `ReconfigureAdapter` type;
   *   this function has two arguments for clarity.
   */
  const reconfigureOrQueue = useCallback(
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

  useEffect(() => {
    if (!getIsAdapterConfigured()) {
      reconfigureOrQueue(adapterArgs, {
        shouldOverwrite: false,
      });
    }
  }, [adapterArgs, getIsAdapterConfigured, reconfigureOrQueue]);

  return [reconfigureOrQueue];
};

function ConfigureAdapter({
  shouldDeferAdapterConfiguration = false,
  adapter,
  adapterArgs,
  adapterStatus,
  defaultFlags = {},
  onFlagsStateChange,
  onStatusStateChange,
  render,
  children,
}: TProps) {
  const [appliedAdapterArgs, applyAdapterArgs] = useAppliedAdapterArgsState({
    initialAdapterArgs: adapterArgs,
  });
  const {
    pendingAdapterArgsRef,
    setPendingAdapterArgs,
    getAdapterArgsForConfiguration,
  } = usePendingAdapterArgsRef(appliedAdapterArgs);
  const {
    setAdapterState,
    getIsAdapterConfigured,
    getDoesAdapterNeedInitialConfiguration,
  } = useAdapterStateRef();

  useDefaultFlagsEffect({
    adapter,
    defaultFlags: {
      ...defaultFlags,
      ...getAllCachedFlags(adapter, adapterArgs.cacheIdentifier),
    },
    onFlagsStateChange,
    onStatusStateChange,
    shouldDeferAdapterConfiguration,
    setAdapterState,
    pendingAdapterArgsRef,
    getAdapterArgsForConfiguration,
    applyAdapterArgs,
  });

  const [reconfigureOrQueue] = usePendingAdapterArgsEffect({
    adapterArgs,
    appliedAdapterArgs,
    applyAdapterArgs,
    getIsAdapterConfigured,
    setPendingAdapterArgs,
  });

  useConfigurationEffect({
    adapter,
    shouldDeferAdapterConfiguration,
    onFlagsStateChange,
    onStatusStateChange,
    setAdapterState,
    pendingAdapterArgsRef,
    getDoesAdapterNeedInitialConfiguration,
    getAdapterArgsForConfiguration,
    getIsAdapterConfigured,
    applyAdapterArgs,
    appliedAdapterArgs,
  });

  const adapterEffectIdentifiers = adapter.effectIds ?? [adapter.id];

  return (
    <AdapterContext.Provider
      value={createAdapterContext(
        adapterEffectIdentifiers,
        reconfigureOrQueue,
        adapterStatus
      )}
    >
      {(() => {
        const isAdapterConfigured = adapter.getIsConfigurationStatus(
          AdapterConfigurationStatus.Configured
        );

        if (isAdapterConfigured) {
          if (typeof render === 'function') {
            return render();
          }
        }

        if (children && isFunctionChildren(children)) {
          return children({
            isAdapterConfigured,
          });
        }

        if (children && !isEmptyChildren(children)) {
          return React.Children.only<React.ReactNode>(children);
        }

        return null;
      })()}
    </AdapterContext.Provider>
  );
}

ConfigureAdapter.displayName = 'ConfigureAdapter';

export { ConfigureAdapter };
