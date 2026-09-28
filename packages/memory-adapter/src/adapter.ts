import { exposeGlobally, normalizeFlag } from '@flopflip/adapter-utilities';
import {
  AdapterConfigurationStatus,
  AdapterInitializationStatus,
  AdapterSubscriptionStatus,
  adapterIdentifiers,
  type TAdapterEventHandlers,
  type TAdapterStatus,
  type TAdapterStatusChange,
  type TFlagName,
  type TFlags,
  type TFlagsChange,
  type TFlagVariation,
  type TMemoryAdapterArgs,
  type TMemoryAdapterInterface,
  type TUpdateFlagsOptions,
  type TUser,
} from '@flopflip/types';
import mitt, { type Emitter } from 'mitt';
import warning from 'tiny-warning';

type TInternalStatusChange = '__internalConfiguredStatusChange__';
type TEmitterEvents = {
  __internalConfiguredStatusChange__: undefined;
  flagsStateChange: TFlags;
  statusStateChange: Partial<TAdapterStatus>;
};
type TEventHandlers = {
  flagsStateChange: (flags: TFlags) => void;
  statusStateChange: (status: Partial<TAdapterStatus>) => void;
};
type TMemoryAdapterState = {
  flags: TFlags;
  lockedFlags: Set<TFlagName>;
  user?: TUser;
  emitter: Emitter<TEmitterEvents>;
};

// A factory, so no two adapters or resets share the same flags, locked
// flags or emitter.
const createInitialAdapterState = (
  emitter: Emitter<TEmitterEvents> = mitt<TEmitterEvents>(),
): TAdapterStatus & TMemoryAdapterState => ({
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  flags: {},
  lockedFlags: new Set<TFlagName>(),
  user: {},
  emitter,
});

class MemoryAdapter implements TMemoryAdapterInterface {
  id: typeof adapterIdentifiers.memory;

  #__internalConfiguredStatusChange__: TInternalStatusChange =
    '__internalConfiguredStatusChange__';

  #adapterState: TAdapterStatus & TMemoryAdapterState;

  #eventHandlers?: TEventHandlers;

  readonly #removeEventHandlers = () => {
    if (!this.#eventHandlers) {
      return;
    }

    this.#adapterState.emitter.off(
      'flagsStateChange',
      this.#eventHandlers.flagsStateChange,
    );
    this.#adapterState.emitter.off(
      'statusStateChange',
      this.#eventHandlers.statusStateChange,
    );
    this.#eventHandlers = undefined;
  };

  // Each `configure` replaces the event handlers of a previous one, so only
  // the latest handlers are invoked.
  readonly #replaceEventHandlers = (eventHandlers: TEventHandlers) => {
    this.#removeEventHandlers();
    this.#eventHandlers = eventHandlers;
    this.#adapterState.emitter.on(
      'flagsStateChange',
      eventHandlers.flagsStateChange,
    );
    this.#adapterState.emitter.on(
      'statusStateChange',
      eventHandlers.statusStateChange,
    );
  };

  constructor() {
    this.#adapterState = createInitialAdapterState();
    this.id = adapterIdentifiers.memory;
  }

  readonly #getIsAdapterUnsubscribed = () =>
    this.#adapterState.subscriptionStatus ===
    AdapterSubscriptionStatus.Unsubscribed;

  readonly #getIsFlagLocked = (flagName: TFlagName) =>
    this.#adapterState.lockedFlags.has(flagName);

  readonly #updateUser = (user: TUser) => {
    this.#adapterState.user = user;
  };

  getUser = () => this.#adapterState.user;

  updateFlags = (flags: TFlags, options?: TUpdateFlagsOptions) => {
    const isAdapterConfigured = this.getIsConfigurationStatus(
      AdapterConfigurationStatus.Configured,
    );

    warning(
      isAdapterConfigured,
      '@flopflip/memory-adapter: adapter is not configured. Flags can not be updated before.',
    );

    if (!isAdapterConfigured) {
      return;
    }

    for (const [flagName, flagValue] of Object.entries(flags)) {
      const [normalizedFlagName, normalizedFlagValue] = normalizeFlag(
        flagName,
        flagValue,
      );

      if (this.#getIsFlagLocked(normalizedFlagName)) {
        return;
      }

      if (options?.lockFlags) {
        this.#adapterState.lockedFlags.add(normalizedFlagName);
      }

      this.#adapterState.flags = {
        ...this.#adapterState.flags,
        [normalizedFlagName]: normalizedFlagValue,
      };
    }

    this.#adapterState.emitter.emit(
      'flagsStateChange',
      this.#adapterState.flags,
    );
  };

  async configure(
    adapterArgs: TMemoryAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers,
  ) {
    const handleFlagsChange = (nextFlags: TFlagsChange['flags']) => {
      if (this.#getIsAdapterUnsubscribed()) {
        return;
      }

      adapterEventHandlers.onFlagsStateChange({
        flags: nextFlags,
        id: this.id,
      });
    };

    const handleStatusChange = (nextStatus: TAdapterStatusChange['status']) => {
      if (this.#getIsAdapterUnsubscribed()) {
        return;
      }

      adapterEventHandlers.onStatusStateChange({
        status: nextStatus,
        id: this.id,
      });
    };

    this.#replaceEventHandlers({
      flagsStateChange: handleFlagsChange,
      statusStateChange: handleStatusChange,
    });

    this.setConfigurationStatus(AdapterConfigurationStatus.Configuring);

    const { user } = adapterArgs;

    this.#adapterState.user = user;

    return Promise.resolve().then(() => {
      this.#adapterState.flags = {};

      this.#updateUser(user);

      this.setConfigurationStatus(AdapterConfigurationStatus.Configured);

      this.#adapterState.emitter.emit(
        'flagsStateChange',
        this.#adapterState.flags,
      );

      this.#adapterState.emitter.emit(this.#__internalConfiguredStatusChange__);

      return {
        initializationStatus: AdapterInitializationStatus.Succeeded,
      };
    });
  }

  async reconfigure(
    adapterArgs: TMemoryAdapterArgs,
    _adapterEventHandlers: TAdapterEventHandlers,
  ) {
    this.setConfigurationStatus(AdapterConfigurationStatus.Configuring);

    this.#updateUser(adapterArgs.user);

    this.#adapterState.flags = {};

    this.setConfigurationStatus(AdapterConfigurationStatus.Configured);

    this.#adapterState.emitter.emit(
      'flagsStateChange',
      this.#adapterState.flags,
    );

    return Promise.resolve({
      initializationStatus: AdapterInitializationStatus.Succeeded,
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
    this.#removeEventHandlers();
    // Keeps the emitter, so pending `waitUntilConfigured` calls still resolve
    // once the adapter is configured again.
    this.#adapterState = createInitialAdapterState(this.#adapterState.emitter);
  };

  async waitUntilConfigured() {
    return new Promise<void>((resolve) => {
      if (
        this.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
      ) {
        resolve();
      } else {
        this.#adapterState.emitter.on(
          this.#__internalConfiguredStatusChange__,
          resolve,
        );
      }
    });
  }

  getFlag(flagName: TFlagName): TFlagVariation {
    return this.#adapterState?.flags[flagName];
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

const adapter = new MemoryAdapter();

exposeGlobally(adapter);

// The class is exported for tests only. The package exports the instance.
export { adapter, MemoryAdapter };
