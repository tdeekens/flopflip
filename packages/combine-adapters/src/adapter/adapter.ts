import { exposeGlobally } from '@flopflip/adapter-utilities';
import {
  AdapterConfigurationStatus,
  adapterIdentifiers,
  AdapterInitializationStatus,
  AdapterSubscriptionStatus,
  type TAdapter,
  type TAdapterEmitFunction,
  type TAdapterEventHandlers,
  type TAdapterIdentifiers,
  type TAdapterStatus,
  type TAdapterStatusChange,
  type TCombinedAdapterArgs,
  type TCombinedAdapterInterface,
  type TFlags,
  type TUpdateFlagsOptions,
} from '@flopflip/types';
import mitt, { type Emitter } from 'mitt';
import warning from 'tiny-warning';

type TInternalStatusChange = '__internalConfiguredStatusChange__';
type TEmitterEvents = {
  __internalConfiguredStatusChange__: undefined;
  flagsStateChange: TFlags;
  statusStateChange: Partial<TAdapterStatus>;
};
type TCombinedAdaptersState = {
  emitter: Emitter<TEmitterEvents>;
};

const intialAdapterState: TAdapterStatus & TCombinedAdaptersState = {
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  emitter: mitt(),
};

class CombineAdapters implements TCombinedAdapterInterface {
  id: typeof adapterIdentifiers.combined;
  effectIds?: TAdapterIdentifiers[];

  // eslint-disable-next-line @typescript-eslint/prefer-readonly
  #__internalConfiguredStatusChange__: TInternalStatusChange =
    '__internalConfiguredStatusChange__';

  #adapters: TAdapter[] = [];
  #adapterState: TAdapterStatus & TCombinedAdaptersState;

  constructor() {
    this.#adapterState = {
      ...intialAdapterState,
    };
    this.id = adapterIdentifiers.combined;
  }

  readonly #getHasCombinedAdapters = () => this.#adapters.length > 0;
  readonly #getHasArgsForAllAdapters = (adapterArgs: TCombinedAdapterArgs) =>
    this.#adapters.every((adapter) => adapterArgs[adapter.id]);

  readonly #getIsAdapterUnsubscribed = () =>
    this.#adapterState.subscriptionStatus ===
    AdapterSubscriptionStatus.Unsubscribed;

  updateFlags = (flags: TFlags, options?: TUpdateFlagsOptions) => {
    const isAdapterConfigured = this.getIsConfigurationStatus(
      AdapterConfigurationStatus.Configured
    );
    const hasCombinedAdapters = this.#getHasCombinedAdapters();

    warning(
      isAdapterConfigured,
      '@flopflip/combine-adapters: adapter is not configured. Flags can not be updated before.'
    );
    warning(
      hasCombinedAdapters,
      '@flopflip/combine-adapters: adapter has no combined adapters. Please combine before updating flags.'
    );

    if (!isAdapterConfigured || !hasCombinedAdapters) {
      return;
    }

    this.#adapters.forEach((adapter) => {
      adapter.updateFlags(flags, options);
    });
  };

  combine(adapters: TAdapter[]) {
    this.#adapters = adapters;
    this.effectIds = adapters.map((adapter) => adapter.id).concat(this.id);
  }

  async configure(
    adapterArgs: TCombinedAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) {
    const hasCombinedAdapters = this.#getHasCombinedAdapters();
    const hasArgsForAllAdapters = this.#getHasArgsForAllAdapters(adapterArgs);

    warning(
      hasCombinedAdapters,
      '@flopflip/combine-adapters: adapter has no combined adapters. Please combine before reconfiguring flags.'
    );
    warning(
      hasArgsForAllAdapters,
      '@flopflip/combine-adapters: not all adapters have args. Please provide args for all adapters.'
    );

    if (!hasCombinedAdapters || !hasArgsForAllAdapters) {
      return Promise.resolve({
        initializationStatus: AdapterInitializationStatus.Failed,
      });
    }

    const handleStatusChange = (nextStatus: TAdapterStatusChange['status']) => {
      if (this.#getIsAdapterUnsubscribed()) return;

      adapterEventHandlers.onStatusStateChange({
        status: nextStatus,
        id: this.id,
      });
    };

    this.#adapterState.emitter.on('statusStateChange', handleStatusChange);

    this.setConfigurationStatus(AdapterConfigurationStatus.Configuring);

    return Promise.all(
      this.#adapters.map(async (adapter) => {
        const adapterArgsForAdapter = adapterArgs[adapter.id];

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return adapter.configure(adapterArgsForAdapter, {
          onFlagsStateChange: adapterEventHandlers.onFlagsStateChange,
          onStatusStateChange: adapterEventHandlers.onStatusStateChange,
        });
      })
    ).then((allInitializationStatus) => {
      const haveAllAdaptersInitializedSuccessfully =
        allInitializationStatus.every(
          ({ initializationStatus }) =>
            initializationStatus === AdapterInitializationStatus.Succeeded
        );

      // NOTE: We consider this adapter configured if all adapters have been asked to do so
      // and have reported to be initialized successfully.
      this.setConfigurationStatus(AdapterConfigurationStatus.Configured);

      this.#adapterState.emitter.emit(this.#__internalConfiguredStatusChange__);

      if (haveAllAdaptersInitializedSuccessfully) {
        return {
          initializationStatus: AdapterInitializationStatus.Succeeded,
        };
      }

      // NOTE: If not all adapters have initialized successfully we can not consider
      // this adapter being configured fully.
      this.setConfigurationStatus(AdapterConfigurationStatus.Unconfigured);

      this.#adapterState.emitter.emit(this.#__internalConfiguredStatusChange__);

      return {
        initializationStatus: AdapterInitializationStatus.Failed,
      };
    });
  }

  async reconfigure(
    adapterArgs: TCombinedAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
  ) {
    this.setConfigurationStatus(AdapterConfigurationStatus.Configuring);

    const hasCombinedAdapters = this.#getHasCombinedAdapters();
    const hasArgsForAllAdapters = this.#getHasArgsForAllAdapters(adapterArgs);

    warning(
      hasCombinedAdapters,
      '@flopflip/combine-adapters: adapter has no combined adapters. Please combine before reconfiguring flags.'
    );
    warning(
      hasArgsForAllAdapters,
      '@flopflip/combine-adapters: not all adapters have args. Please provide args for all adapters.'
    );

    if (!hasCombinedAdapters || !hasArgsForAllAdapters) {
      return Promise.resolve({
        initializationStatus: AdapterInitializationStatus.Failed,
      });
    }

    return Promise.all(
      this.#adapters.map(async (adapter) => {
        const adapterArgsForAdapter = adapterArgs[adapter.id];

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return adapter.reconfigure(adapterArgsForAdapter, {
          onFlagsStateChange: adapterEventHandlers.onFlagsStateChange,
          onStatusStateChange: adapterEventHandlers.onStatusStateChange,
        });
      })
    ).then((allInitializationStatus) => {
      const haveAllAdaptersInitializedSuccessfully =
        allInitializationStatus.every(
          ({ initializationStatus }) =>
            initializationStatus === AdapterInitializationStatus.Succeeded
        );

      // NOTE: We consider this adapter reconfigured if all adapters have been asked to do so
      // and have reported to be initialized successfully.
      this.setConfigurationStatus(AdapterConfigurationStatus.Configured);

      this.#adapterState.emitter.emit(this.#__internalConfiguredStatusChange__);

      if (haveAllAdaptersInitializedSuccessfully) {
        return { initializationStatus: AdapterInitializationStatus.Succeeded };
      }

      // NOTE: If not all adapters have initialized successfully we can not consider
      // this adapter being configured fully.
      this.setConfigurationStatus(AdapterConfigurationStatus.Unconfigured);

      this.#adapterState.emitter.emit(this.#__internalConfiguredStatusChange__);

      return { initializationStatus: AdapterInitializationStatus.Failed };
    });
  }

  getIsConfigurationStatus(configurationStatus: AdapterConfigurationStatus) {
    return this.#adapterState.configurationStatus === configurationStatus;
  }

  setConfigurationStatus(nextConfigurationStatus: AdapterConfigurationStatus) {
    this.#adapterState.configurationStatus = nextConfigurationStatus;

    this.emit();
  }

  emit: TAdapterEmitFunction = () => {
    this.#adapterState.emitter.emit('statusStateChange', {
      configurationStatus: this.#adapterState.configurationStatus,
    });
  };

  reset = () => {
    this.#adapterState = {
      ...intialAdapterState,
    };
  };

  async waitUntilConfigured() {
    return Promise.all(
      this.#adapters.map(async (adapter) => adapter?.waitUntilConfigured?.())
    );
  }

  unsubscribe = () => {
    this.#adapterState.subscriptionStatus =
      AdapterSubscriptionStatus.Unsubscribed;
  };

  subscribe = () => {
    this.#adapterState.subscriptionStatus =
      AdapterSubscriptionStatus.Subscribed;
  };
}

const adapter = new CombineAdapters();

exposeGlobally(adapter);

export default adapter;
