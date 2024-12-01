import { getAllCachedFlags } from '@flopflip/cache';
import {
  AdapterConfigurationStatus,
  AdapterInitializationStatus,
  type TAdapter,
  type TAdapterArgs,
  type TAdapterConfiguration,
  type TAdapterEventHandlers,
  type TAdapterInterface,
  type TAdapterReconfiguration,
  type TAdapterReconfigurationOptions,
  type TAdaptersStatus,
  type TConfigureAdapterChildren,
  type TFlags,
} from '@flopflip/types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import warning from 'tiny-warning';

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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

type TUseAdapterStateRefReturn = [
  React.MutableRefObject<TAdapterStates>,
  (nextAdapterState: TAdapterStates) => void,
  () => boolean,
  () => boolean,
];
const useAdapterStateRef = (): TUseAdapterStateRefReturn => {
  const adapterStateRef = useRef<TAdapterStates>(AdapterStates.UNCONFIGURED);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const setAdapterState = useCallback(
    (nextAdapterState: TAdapterStates) => {
      adapterStateRef.current = nextAdapterState;
    },
    [adapterStateRef]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const getIsAdapterConfigured = useCallback(
    () => adapterStateRef.current === AdapterStates.CONFIGURED,
    [adapterStateRef]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const getDoesAdapterNeedInitialConfiguration = useCallback(
    () =>
      adapterStateRef.current !== AdapterStates.CONFIGURED &&
      adapterStateRef.current !== AdapterStates.CONFIGURING,
    [adapterStateRef]
  );

  return [
    adapterStateRef,
    setAdapterState,
    getIsAdapterConfigured,
    getDoesAdapterNeedInitialConfiguration,
  ];
};

type TUsePendingAdapterArgsRefReturn = [
  React.MutableRefObject<TAdapterArgs | undefined>,
  (nextReconfiguration: TAdapterReconfiguration) => void,
  () => TAdapterArgs,
];
const usePendingAdapterArgsRef = (
  appliedAdapterArgs: TAdapterArgs
): TUsePendingAdapterArgsRefReturn => {
  const pendingAdapterArgsRef = useRef<TAdapterArgs | undefined>(undefined);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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
    [appliedAdapterArgs, pendingAdapterArgsRef]
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const unsetPendingAdapterArgs = useCallback(() => {
    pendingAdapterArgsRef.current = undefined;
  }, [pendingAdapterArgsRef]);

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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const getAdapterArgsForConfiguration = useCallback(
    (): TAdapterArgs => pendingAdapterArgsRef.current ?? appliedAdapterArgs,
    [appliedAdapterArgs, pendingAdapterArgsRef]
  );

  /**
   * NOTE: Clears the pending adapter args when applied adapter args changed.
   */

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(unsetPendingAdapterArgs, [
    appliedAdapterArgs,
    unsetPendingAdapterArgs,
  ]);

  return [
    pendingAdapterArgsRef,
    setPendingAdapterArgs,
    getAdapterArgsForConfiguration,
  ];
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
  getDoesAdapterNeedInitialConfiguration: TUseAdapterStateRefReturn['3'];
  setAdapterState: TUseAdapterStateRefReturn['1'];
  onFlagsStateChange: TAdapterEventHandlers['onFlagsStateChange'];
  onStatusStateChange: TAdapterEventHandlers['onStatusStateChange'];
  applyAdapterArgs: TUseAppliedAdapterArgsStateReturn['1'];
  getAdapterArgsForConfiguration: TUsePendingAdapterArgsRefReturn['2'];
  getIsAdapterConfigured: TUseAdapterStateRefReturn['2'];
  pendingAdapterArgsRef: TUsePendingAdapterArgsRefReturn['0'];
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
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
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
        .then((configuration: TAdapterConfiguration) => {
          /**
           * NOTE:
           *    The configuration can be `undefined` then assuming `initializationStatus` to have
           *    succeeded to work with old adapters.
           */
          const isAdapterWithoutInitializationStatus =
            !configuration?.initializationStatus;

          if (
            isAdapterWithoutInitializationStatus ||
            configuration.initializationStatus ===
              AdapterInitializationStatus.Succeeded
          ) {
            setAdapterState(AdapterStates.CONFIGURED);

            if (pendingAdapterArgsRef.current) {
              applyAdapterArgs(pendingAdapterArgsRef.current);
            }
          }
        })
        .catch(() => {
          warning(false, '@flopflip/react: adapter could not be configured.');
        });
    }

    if (getIsAdapterConfigured()) {
      setAdapterState(AdapterStates.CONFIGURING);

      (adapter as TAdapterInterface<TAdapterArgs>)
        .reconfigure(getAdapterArgsForConfiguration(), {
          onFlagsStateChange,
          onStatusStateChange,
        })
        .then((reconfiguration: TAdapterConfiguration) => {
          /**
           * NOTE:
           *    The configuration can be `undefined` then assuming `initializationStatus` to have
           *    succeeded to work with old adapters.
           */
          const isAdapterWithoutInitializationStatus =
            !reconfiguration?.initializationStatus;

          if (
            isAdapterWithoutInitializationStatus ||
            reconfiguration.initializationStatus ===
              AdapterInitializationStatus.Succeeded
          ) {
            setAdapterState(AdapterStates.CONFIGURED);
          }
        })
        .catch(() => {
          warning(false, '@flopflip/react: adapter could not be reconfigured.');
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
  setAdapterState: TUseAdapterStateRefReturn['1'];
  pendingAdapterArgsRef: TUsePendingAdapterArgsRefReturn['0'];
  shouldDeferAdapterConfiguration: TProps['shouldDeferAdapterConfiguration'];
  applyAdapterArgs: TUseAppliedAdapterArgsStateReturn['1'];
  getAdapterArgsForConfiguration: TUsePendingAdapterArgsRefReturn['2'];
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (defaultFlags) {
      handleDefaultFlags(defaultFlags);
    }

    if (!shouldDeferAdapterConfiguration) {
      setAdapterState(AdapterStates.CONFIGURING);

      (adapter as TAdapterInterface<TAdapterArgs>)
        .configure(getAdapterArgsForConfiguration(), {
          onFlagsStateChange,
          onStatusStateChange,
        })
        .then((configuration: TAdapterConfiguration) => {
          /**
           * NOTE:
           *    The configuration can be `undefined` then assuming `initializationStatus` to have
           *    succeeded to work with old adapters.
           */
          const isAdapterWithoutInitializationStatus =
            !configuration?.initializationStatus;

          if (
            isAdapterWithoutInitializationStatus ||
            configuration.initializationStatus ===
              AdapterInitializationStatus.Succeeded
          ) {
            setAdapterState(AdapterStates.CONFIGURED);

            if (pendingAdapterArgsRef.current) {
              applyAdapterArgs(pendingAdapterArgsRef.current);
            }
          }
        })
        .catch(() => {
          warning(false, '@flopflip/react: adapter could not be configured.');
        });
    }
  }, []);
};

type TUsePendingAdapterArgsEffectOptions = {
  adapterArgs: TAdapterArgs;
  appliedAdapterArgs: TAdapterArgs;
  applyAdapterArgs: TUseAppliedAdapterArgsStateReturn['1'];
  getIsAdapterConfigured: TUseAdapterStateRefReturn['2'];
  setPendingAdapterArgs: TUsePendingAdapterArgsRefReturn['1'];
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
   *   this function has two arguments for clarify.
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
  const [
    pendingAdapterArgsRef,
    setPendingAdapterArgs,
    getAdapterArgsForConfiguration,
  ] = usePendingAdapterArgsRef(appliedAdapterArgs);
  const [
    ,
    setAdapterState,
    getIsAdapterConfigured,
    getDoesAdapterNeedInitialConfiguration,
  ] = useAdapterStateRef();
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
