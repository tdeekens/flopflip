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
} from '@flopflip/types';
import {
  isFunctionChildren,
  isEmptyChildren,
  mergeAdapterArgs,
} from './helpers';
import AdapterContext, { createAdapterContext } from '../adapter-context';

type valueof<T> = T[keyof T];

type AdapterStates = {
  UNCONFIGURED: string;
  CONFIGURING: string;
  CONFIGURED: string;
};
export const AdapterStates: AdapterStates = {
  UNCONFIGURED: 'unconfigured',
  CONFIGURING: 'configuring',
  CONFIGURED: 'configured',
};

type Props = {
  shouldDeferAdapterConfiguration?: boolean;
  adapter: TAdapter;
  adapterArgs: TAdapterArgs;
  adapterStatus?: TAdapterStatus;
  defaultFlags?: TFlags;
  onFlagsStateChange: (flags: TFlags) => void;
  onStatusStateChange: (status: TAdapterStatus) => void;
  render?: () => React.ReactNode;
  children?: TConfigureAdapterChildren;
};
type State = {
  appliedAdapterArgs: TAdapterArgs;
};
type AdapterState = valueof<AdapterStates>;

// eslint-disable-next-line react/no-unsafe
export default class ConfigureAdapter extends React.PureComponent<
  Props,
  State
> {
  static defaultProps = {
    shouldDeferAdapterConfiguration: false,
    defaultFlags: {},
    children: null,
    render: null,
  };

  adapterState: AdapterState = AdapterStates.UNCONFIGURED;
  pendingAdapterArgs?: TAdapterArgs | null = null;

  state: { appliedAdapterArgs: TAdapterArgs } = {
    appliedAdapterArgs: this.props.adapterArgs,
  };

  setAdapterState = (nextAdapterState: AdapterState): void => {
    this.adapterState = nextAdapterState;
  };

  applyAdapterArgs = (nextAdapterArgs: TAdapterArgs): void =>
    /**
     * NOTE:
     *   We can only unset `pendingAdapterArgs` after be actually perform
     *   a batched `setState` otherwise outdated `adapterArgs` as we loose
     *   the `pendingAdapterArgs` as we unset them too early.
     */
    this.setState(
      {
        appliedAdapterArgs: nextAdapterArgs,
      },
      () => {
        this.pendingAdapterArgs = null;
      }
    );

  getIsAdapterConfigured = () =>
    this.adapterState === AdapterStates.CONFIGURED &&
    this.adapterState !== AdapterStates.CONFIGURING;

  getDoesAdapterNeedInitialConfiguration = () =>
    this.adapterState !== AdapterStates.CONFIGURED &&
    this.adapterState !== AdapterStates.CONFIGURING;

  /**
   * NOTE:
   *   This is passed through the React context (it's a public API).
   *   Internally this component has a `ReconfigureAdapter` type;
   *   this function has two arguments for clarify.
   */
  reconfigureOrQueue = (
    nextAdapterArgs: TAdapterArgs,
    options: TAdapterReconfigurationOptions
  ): void =>
    this.getIsAdapterConfigured()
      ? this.applyAdapterArgs(
          mergeAdapterArgs(this.state.appliedAdapterArgs, {
            adapterArgs: nextAdapterArgs,
            options,
          })
        )
      : this.setPendingAdapterArgs({ adapterArgs: nextAdapterArgs, options });

  setPendingAdapterArgs = (
    nextReconfiguration: TAdapterReconfiguration
  ): void => {
    /**
     * NOTE:
     *    The next reconfiguration is merged into the previous
     *    one instead of maintaining a queue.
     *
     *    The first merge with merge with `appliedAdapter` args
     *    to contain the initial state (through property initializer).
     */
    this.pendingAdapterArgs = mergeAdapterArgs(
      this.pendingAdapterArgs ?? this.state.appliedAdapterArgs,
      nextReconfiguration
    );
  };

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
  getAdapterArgsForConfiguration = (): TAdapterArgs =>
    this.pendingAdapterArgs ?? this.state.appliedAdapterArgs;

  handleDefaultFlags = (defaultFlags: TFlags): void => {
    if (Object.keys(defaultFlags).length > 0) {
      this.props.onFlagsStateChange(defaultFlags);
    }
  };

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
  UNSAFE_componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.adapterArgs !== this.props.adapterArgs) {
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
      this.reconfigureOrQueue(nextProps.adapterArgs, {
        shouldOverwrite: this.adapterState === AdapterStates.CONFIGURED,
      });
    }
  }

  componentDidMount(): Promise<any> | void {
    if (this.props.defaultFlags)
      this.handleDefaultFlags(this.props.defaultFlags);

    if (!this.props.shouldDeferAdapterConfiguration) {
      this.setAdapterState(AdapterStates.CONFIGURING);

      return (this.props.adapter as TAdapterInterface<TAdapterArgs>)
        .configure(this.getAdapterArgsForConfiguration(), {
          onFlagsStateChange: this.props.onFlagsStateChange,
          onStatusStateChange: this.props.onStatusStateChange,
        })
        .then(() => {
          this.setAdapterState(AdapterStates.CONFIGURED);
          if (this.pendingAdapterArgs) {
            this.applyAdapterArgs(this.pendingAdapterArgs);
          }
        });
    }
  }

  componentDidUpdate(): Promise<any> | void {
    /**
     * NOTE:
     *    Be careful here to not double configure from `componentDidMount`.
     *    Moreover, cDU will also be invoked from `setState` to `appliedAdapterArgs`.
     *    Hence, avoid calling `setState` within cDU.
     */

    if (
      !this.props.shouldDeferAdapterConfiguration &&
      this.getDoesAdapterNeedInitialConfiguration()
    ) {
      this.setAdapterState(AdapterStates.CONFIGURING);

      return (this.props.adapter as TAdapterInterface<TAdapterArgs>)
        .configure(this.getAdapterArgsForConfiguration(), {
          onFlagsStateChange: this.props.onFlagsStateChange,
          onStatusStateChange: this.props.onStatusStateChange,
        })
        .then(() => {
          this.setAdapterState(AdapterStates.CONFIGURED);

          if (this.pendingAdapterArgs) {
            this.applyAdapterArgs(this.pendingAdapterArgs);
          }
        });
    }

    if (this.getIsAdapterConfigured()) {
      this.setAdapterState(AdapterStates.CONFIGURING);

      return (this.props.adapter as TAdapterInterface<TAdapterArgs>)
        .reconfigure(this.getAdapterArgsForConfiguration(), {
          onFlagsStateChange: this.props.onFlagsStateChange,
          onStatusStateChange: this.props.onStatusStateChange,
        })
        .then(() => {
          this.setAdapterState(AdapterStates.CONFIGURED);
        });
    }
  }

  render(): React.ReactNode {
    return (
      <AdapterContext.Provider
        value={createAdapterContext(
          this.reconfigureOrQueue,
          this.props.adapterStatus
        )}
      >
        {(() => {
          const isAdapterReady = this.props.adapter.getIsReady();

          if (isAdapterReady) {
            if (typeof this.props.render === 'function')
              return this.props.render();
          }

          if (isFunctionChildren(this.props.children))
            return this.props.children({
              isAdapterReady,
            });

          if (this.props.children && !isEmptyChildren(this.props.children))
            return React.Children.only<React.ReactNode>(this.props.children);

          return null;
        })()}
      </AdapterContext.Provider>
    );
  }
}
