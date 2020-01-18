import invariant from 'invariant';
import mitt, { Emitter } from 'mitt';
import {
  User,
  AdapterStatus,
  FlagName,
  FlagVariation,
  Flag,
  Flags,
  AdapterEventHandlers,
  MemoryAdapterInterface,
  MemoryAdapterArgs,
  interfaceIdentifiers,
} from '@flopflip/types';
import camelCase from 'lodash/camelCase';

type MemoryAdapterState = {
  flags: Flags;
  user?: User;
  emitter: Emitter;
};

const intialAdapterState: AdapterStatus & MemoryAdapterState = {
  isReady: false,
  flags: {},
  user: {},
  // Typings are incorrect and state that mitt is not callable.
  // Value of type 'MittStatic' is not callable. Did you mean to include 'new'
  // @ts-ignore
  emitter: mitt(),
};

let adapterState: AdapterStatus & MemoryAdapterState = {
  ...intialAdapterState,
};
const updateUser = (user: User): void => {
  adapterState.user = user;
};

const normalizeFlag = (flagName: FlagName, flagValue?: FlagVariation): Flag => [
  camelCase(flagName),
  // Multi variate flags contain a string or `null` - `false` seems more natural.
  flagValue === null || flagValue === undefined ? false : flagValue,
];
export const normalizeFlags = (rawFlags: Flags): Flags =>
  Object.entries(rawFlags).reduce<Flags>(
    (normalizedFlags: Flags, [flagName, flagValue]) => {
      const [normalizedFlagName, normalizedFlagValue]: Flag = normalizeFlag(
        flagName,
        flagValue
      );
      // Can't return expression as it is the assigned value
      normalizedFlags[normalizedFlagName] = normalizedFlagValue;

      return normalizedFlags;
    },
    {}
  );

export const getUser = (): User | undefined => adapterState.user;

export const updateFlags = (flags: Flags) => {
  const isAdapterReady = Boolean(
    adapterState.isConfigured && adapterState.isReady
  );

  invariant(
    isAdapterReady,
    '@flopflip/memory-adapter: adapter not ready and configured. Flags can not be updated before.'
  );

  if (!isAdapterReady) return;

  adapterState.flags = {
    ...adapterState.flags,
    ...normalizeFlags(flags),
  };

  adapterState.emitter.emit('flagsStateChange', adapterState.flags);
};

class MemoryAdapter implements MemoryAdapterInterface {
  id: typeof interfaceIdentifiers.memory;

  constructor() {
    this.id = interfaceIdentifiers.memory;
  }

  configure(
    adapterArgs: MemoryAdapterArgs,
    adapterEventHandlers: AdapterEventHandlers
  ): Promise<any> {
    const { user } = adapterArgs;

    adapterState.user = user;

    return Promise.resolve().then(() => {
      adapterState.isConfigured = true;
      adapterState.isReady = true;
      adapterState.flags = {};

      updateUser(user);

      adapterState.emitter.on(
        'flagsStateChange',
        adapterEventHandlers.onFlagsStateChange
      );
      adapterState.emitter.on(
        'statusStateChange',
        adapterEventHandlers.onStatusStateChange
      );

      adapterState.emitter.emit('flagsStateChange', adapterState.flags);
      adapterState.emitter.emit('statusStateChange', {
        isReady: adapterState.isReady,
        isConfigured: adapterState.isConfigured,
      });

      adapterState.emitter.emit('readyStateChange');
    });
  }

  reconfigure(
    adapterArgs: MemoryAdapterArgs,
    _adapterEventHandlers: AdapterEventHandlers
  ): Promise<any> {
    updateUser(adapterArgs.user);

    adapterState.flags = {};
    adapterState.emitter.emit('flagsStateChange', adapterState.flags);
    adapterState.emitter.emit('statusStateChange', {
      isConfigured: adapterState.isConfigured,
    });

    return Promise.resolve();
  }

  getIsReady(): boolean {
    return Boolean(adapterState.isReady);
  }

  setIsReady(nextState: AdapterStatus): void {
    adapterState.isReady = nextState.isReady;

    adapterState.emitter.emit('statusStateChange', {
      isReady: adapterState.isReady,
    });
  }

  reset = (): void => {
    adapterState = {
      ...intialAdapterState,
    };
  };

  waitUntilConfigured(): Promise<any> {
    return new Promise(resolve => {
      if (adapterState.isConfigured) resolve();
      else adapterState.emitter.on('readyStateChange', resolve);
    });
  }

  getFlag(flagName: FlagName): FlagVariation | undefined {
    return adapterState.flags && adapterState.flags[flagName];
  }

  // For convenience
  updateFlags(flags: Flags): void {
    return updateFlags(flags);
  }
}

const adapter = new MemoryAdapter();
export default adapter;
