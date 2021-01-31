import type {
  TAdapterStatus,
  TAdapterStatusChange,
  TAdapterEventHandlers,
  TCombinedAdapterArgs,
  TFlags,
  TAdapter,
  TUpdateFlagsOptions,
  TCombinedAdapterInterface,
  TAdapterIdentifiers,
} from '@flopflip/types';
import {
  AdapterInitializationStatus,
  AdapterSubscriptionStatus,
  AdapterConfigurationStatus,
  adapterIdentifiers,
} from '@flopflip/types';
import { exposeGlobally } from '@flopflip/adapter-utilities';

import warning from 'tiny-warning';
import mitt, { Emitter } from 'mitt';

type CombinedAdaptersState = {
  emitter: Emitter;
};

const intialAdapterState: TAdapterStatus & CombinedAdaptersState = {
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  // Typings are incorrect and state that mitt is not callable.
  // Value of type 'MittStatic' is not callable. Did you mean to include 'new'
  emitter: mitt(),
};

class CombineAdapters implements TCombinedAdapterInterface {
  #__internalConfiguredStatusChange__ = '__internalConfiguredStatusChange__';
  #adapters: TAdapter[] = [];
  #adapterState: TAdapterStatus & CombinedAdaptersState;

  id: typeof adapterIdentifiers.combined;
  effectIds?: TAdapterIdentifiers[];

  constructor() {
    this.#adapterState = {
      ...intialAdapterState,
    };
    this.id = adapterIdentifiers.combined;
  }

  #getHasCombinedAdapters = () => this.#adapters.length > 0;
  #getHasArgsForAllAdapters = (adapterArgs: TCombinedAdapterArgs) =>
    this.#adapters.every((adapter) => adapterArgs[adapter.id]);

  #getIsAdapterUnsubscribed = () =>
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

    this.#adapterState.emitter.on<TAdapterStatusChange>(
      'statusStateChange',
      // @ts-expect-error
      handleStatusChange
    );

    this.setConfigurationStatus(AdapterConfigurationStatus.Configuring);

    return Promise.all(
      this.#adapters.map(async (adapter) => {
        return adapter.configure(adapterArgs[adapter.id], {
          onFlagsStateChange: adapterEventHandlers.onFlagsStateChange,
          onStatusStateChange: () => undefined,
        });
      })
    ).then((allInitializationStatus) => {
      const haveAllAdaptersInitializedSuccessfully = allInitializationStatus.every(
        ({ initializationStatus }) =>
          initializationStatus === AdapterInitializationStatus.Succeeded
      );

      if (haveAllAdaptersInitializedSuccessfully) {
        this.setConfigurationStatus(AdapterConfigurationStatus.Configured);

        this.#adapterState.emitter.emit(
          this.#__internalConfiguredStatusChange__
        );

        return {
          initializationStatus: AdapterInitializationStatus.Succeeded,
        };
      }

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
        return adapter.reconfigure(adapterArgs[adapter.id], {
          onFlagsStateChange: adapterEventHandlers.onFlagsStateChange,
          onStatusStateChange: () => undefined,
        });
      })
    ).then((allInitializationStatus) => {
      const haveAllAdaptersInitializedSuccessfully = allInitializationStatus.every(
        ({ initializationStatus }) =>
          initializationStatus === AdapterInitializationStatus.Succeeded
      );

      if (haveAllAdaptersInitializedSuccessfully) {
        return { initializationStatus: AdapterInitializationStatus.Succeeded };
      }

      return { initializationStatus: AdapterInitializationStatus.Failed };
    });
  }

  getIsConfigurationStatus(configurationStatus: AdapterConfigurationStatus) {
    return this.#adapterState.configurationStatus === configurationStatus;
  }

  setConfigurationStatus(nextConfigurationStatus: AdapterConfigurationStatus) {
    this.#adapterState.configurationStatus = nextConfigurationStatus;

    this.#adapterState.emitter.emit('statusStateChange', {
      configurationStatus: this.#adapterState.configurationStatus,
    });
  }

  reset = () => {
    this.#adapterState = {
      ...intialAdapterState,
    };
  };

  async waitUntilConfigured() {
    return new Promise<void>((resolve) => {
      if (
        this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
      ) {
        resolve();
      } else
        this.#adapterState.emitter.on(
          this.#__internalConfiguredStatusChange__,
          resolve
        );
    });
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
