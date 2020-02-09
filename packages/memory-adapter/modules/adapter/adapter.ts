import invariant from 'invariant';
import mitt, { Emitter } from 'mitt';
import {
  TUser,
  TAdapterStatus,
  TFlagName,
  TFlagVariation,
  TFlag,
  TFlags,
  TAdapterEventHandlers,
  TMemoryAdapterInterface,
  TMemoryAdapterArgs,
  interfaceIdentifiers,
} from '@flopflip/types';
import camelCase from 'lodash/camelCase';

type MemoryAdapterState = {
  flags: TFlags;
  user?: TUser;
  emitter: Emitter;
};

const intialAdapterState: TAdapterStatus & MemoryAdapterState = {
  isReady: false,
  flags: {},
  user: {},
  // Typings are incorrect and state that mitt is not callable.
  // Value of type 'MittStatic' is not callable. Did you mean to include 'new'
  // @ts-ignore
  emitter: mitt(),
};

let adapterState: TAdapterStatus & MemoryAdapterState = {
  ...intialAdapterState,
};
const updateUser = (user: TUser): void => {
  adapterState.user = user;
};

const normalizeFlag = (
  flagName: TFlagName,
  flagValue?: TFlagVariation
): TFlag => [
  camelCase(flagName),
  // Multi variate flags contain a string or `null` - `false` seems more natural.
  flagValue === null || flagValue === undefined ? false : flagValue,
];
export const normalizeFlags = (rawFlags: TFlags): TFlags =>
  Object.entries(rawFlags).reduce<TFlags>(
    (normalizedFlags: TFlags, [flagName, flagValue]) => {
      const [normalizedFlagName, normalizedFlagValue]: TFlag = normalizeFlag(
        flagName,
        flagValue
      );
      // Can't return expression as it is the assigned value
      normalizedFlags[normalizedFlagName] = normalizedFlagValue;

      return normalizedFlags;
    },
    {}
  );

export const getUser = (): TUser | undefined => adapterState.user;

export const updateFlags = (flags: TFlags) => {
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

class MemoryAdapter implements TMemoryAdapterInterface {
  id: typeof interfaceIdentifiers.memory;

  constructor() {
    this.id = interfaceIdentifiers.memory;
  }

  configure(
    adapterArgs: TMemoryAdapterArgs,
    adapterEventHandlers: TAdapterEventHandlers
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
    adapterArgs: TMemoryAdapterArgs,
    _adapterEventHandlers: TAdapterEventHandlers
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

  setIsReady(nextState: TAdapterStatus): void {
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

  getFlag(flagName: TFlagName): TFlagVariation | undefined {
    return adapterState.flags && adapterState.flags[flagName];
  }

  // For convenience
  updateFlags(flags: TFlags): void {
    return updateFlags(flags);
  }
}

const adapter = new MemoryAdapter();
export default adapter;
