import { adapter as localstorageAdapter } from '@flopflip/localstorage-adapter';
import { adapter as memoryAdapter } from '@flopflip/memory-adapter';
import {
  AdapterConfigurationStatus,
  AdapterInitializationStatus,
} from '@flopflip/types';
import getGlobalThis from 'globalthis';
import warning from 'tiny-warning';
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { adapter } from '../src/adapter';

vi.mock('tiny-warning', {
  default: vi.fn(),
});

const createAdapterArgs = (customArgs = {}) => ({
  user: { id: 'foo' },
  [memoryAdapter.id]: {
    user: {
      id: 'memory-adapter-user-id',
    },
  },
  [localstorageAdapter.id]: {
    user: {
      id: 'localstorage-adapter-user-id',
    },
  },
  ...customArgs,
});
const createAdapterEventHandlers = (custom = {}) => ({
  onFlagsStateChange: vi.fn(),
  onStatusStateChange: vi.fn(),
  ...custom,
});

describe('when combining', () => {
  const updatedFlags = { fooFlag: true, barFlag: false };
  let adapterArgs;
  let adapterEventHandlers;

  beforeEach(() => {
    warning.mockClear();
    adapterArgs = createAdapterArgs();
    adapterEventHandlers = createAdapterEventHandlers();
  });

  it('should indicate that the adapter is not configured', () => {
    expect(
      adapter.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
    ).toBe(false);
  });

  describe('when configuring', () => {
    describe('without combined adapters', () => {
      let configurationResult;

      beforeEach(async () => {
        configurationResult = await adapter.configure(
          adapterArgs,
          adapterEventHandlers
        );
      });

      it('should invoke and trigger `warning`', () => {
        expect(warning).toHaveBeenCalledWith(
          false,
          expect.stringContaining('adapter has no combined adapters')
        );
      });

      it('should resolve configuration to have failed', () => {
        expect(configurationResult).toEqual({
          initializationStatus: AdapterInitializationStatus.Failed,
        });
      });
    });

    describe('without args for all adapters', () => {
      let configurationResult;

      beforeEach(async () => {
        adapter.combine([memoryAdapter, localstorageAdapter]);

        adapterArgs = createAdapterArgs({ [memoryAdapter.id]: null });
        configurationResult = await adapter.configure(
          adapterArgs,
          adapterEventHandlers
        );
      });

      it('should invoke and trigger `warning`', () => {
        expect(warning).toHaveBeenCalledWith(
          false,
          expect.stringContaining('not all adapters have args')
        );
      });

      it('should resolve configuration to have failed', () => {
        expect(configurationResult).toEqual({
          initializationStatus: AdapterInitializationStatus.Failed,
        });
      });
    });
  });

  describe('when all configured successfully', () => {
    beforeAll(() => {
      adapter.combine([memoryAdapter, localstorageAdapter]);
    });

    let configurationResult;

    const memoryAdapterConfigureSpy = vi.spyOn(memoryAdapter, 'configure');
    const localstorageAdapterConfigureSpy = vi.spyOn(
      localstorageAdapter,
      'configure'
    );

    beforeEach(async () => {
      configurationResult = await adapter.configure(
        adapterArgs,
        adapterEventHandlers
      );
    });

    it('should assign the effect ids for each adapter and itself', () => {
      expect(adapter.effectIds).toEqual([
        memoryAdapter.id,
        localstorageAdapter.id,
        adapter.id,
      ]);
    });

    it('should invoke `onStatusStateChange` with configuring', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          id: adapter.id,
          status: {
            configurationStatus: AdapterConfigurationStatus.Configuring,
          },
        })
      );
    });

    it('should indicate that the adapter is configured', () => {
      expect(
        adapter.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
      ).toBe(true);
    });

    it('should invoke `configure` on all adapters', () => {
      expect(memoryAdapterConfigureSpy).toHaveBeenCalledWith(
        adapterArgs[memoryAdapter.id],
        expect.anything()
      );
      expect(localstorageAdapterConfigureSpy).toHaveBeenCalledWith(
        adapterArgs[localstorageAdapter.id],
        expect.anything()
      );
    });

    it('should invoke `onStatusStateChange`', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalled();
    });

    it('should resolve `waitUntilConfigured`', async () => {
      await expect(adapter.waitUntilConfigured()).resolves.toBeDefined();
    });

    describe('invocation of `onStatusStateChange`', () => {
      describe('of `combine-adapters`', () => {
        it('should invoke `onStatusStateChange` with configured', () => {
          expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
            expect.objectContaining({
              id: adapter.id,
              status: {
                configurationStatus: AdapterConfigurationStatus.Configured,
              },
            })
          );
        });
      });

      describe('of `memory-adapter`', () => {
        it('should invoke `onStatusStateChange` with configured', () => {
          expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
            expect.objectContaining({
              id: memoryAdapter.id,
              status: {
                configurationStatus: AdapterConfigurationStatus.Configured,
              },
            })
          );
        });
      });

      describe('of `localstorage-adapter`', () => {
        it('should invoke `onStatusStateChange` with configured', () => {
          expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
            expect.objectContaining({
              id: localstorageAdapter.id,
              status: {
                configurationStatus: AdapterConfigurationStatus.Configured,
              },
            })
          );
        });
      });
    });

    it('should invoke `onFlagsStateChange`', () => {
      expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
    });

    describe('when updating flags of an underlying adapter', () => {
      beforeEach(() => {
        adapterEventHandlers.onFlagsStateChange.mockClear();

        memoryAdapter.updateFlags(updatedFlags);
      });

      it('should invoke but not trigger `warning`', () => {
        expect(warning).toHaveBeenCalledWith(true, expect.any(String));
      });

      it('should invoke `onFlagsStateChange`', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
      });

      it('should invoke `onFlagsStateChange` with `updatedFlags` and id of the memory adapter', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
          id: memoryAdapter.id,
          flags: expect.objectContaining(updatedFlags),
        });
      });
    });

    describe('when updating flags of the combined adapter', () => {
      beforeEach(() => {
        // From `configure`
        adapterEventHandlers.onFlagsStateChange.mockClear();

        adapter.updateFlags(updatedFlags);
      });

      it('should invoke but not trigger `warning`', () => {
        expect(warning).toHaveBeenCalledWith(true, expect.any(String));
      });

      it('should invoke `onFlagsStateChange` with `updatedFlags` for all combined adapters', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
          id: memoryAdapter.id,
          flags: expect.objectContaining(updatedFlags),
        });
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
          id: localstorageAdapter.id,
          flags: expect.objectContaining(updatedFlags),
        });
      });
    });

    describe('when updating flags existing in both adapters', () => {
      const similarFlags = updatedFlags;
      beforeEach(() => {
        adapterEventHandlers.onFlagsStateChange.mockClear();

        memoryAdapter.updateFlags({ ...similarFlags, duplicateFlag: true });
        localstorageAdapter.updateFlags({
          ...similarFlags,
          duplicateFlag: false,
        });
      });

      it('should invoke `onFlagsStateChange` with `updatedFlags` for all combined adapters', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
          id: memoryAdapter.id,
          flags: expect.objectContaining(similarFlags),
        });
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
          id: localstorageAdapter.id,
          flags: expect.objectContaining(similarFlags),
        });
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
          id: memoryAdapter.id,
          flags: expect.objectContaining({ duplicateFlag: true }),
        });
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
          id: localstorageAdapter.id,
          flags: expect.objectContaining({ duplicateFlag: false }),
        });
      });
    });

    describe('when reconfiguring', () => {
      const user = { id: 'bar' };

      const memoryAdapterReconfigureSpy = vi.spyOn(
        memoryAdapter,
        'reconfigure'
      );
      const localstorageAdapterReconfigureSpy = vi.spyOn(
        localstorageAdapter,
        'reconfigure'
      );

      beforeEach(async () => {
        configurationResult = await adapter.reconfigure(
          { [localstorageAdapter.id]: { user }, [memoryAdapter.id]: { user } },
          adapterEventHandlers
        );
        adapterEventHandlers = createAdapterEventHandlers();
      });

      it('should resolve to a successful initialization status', () => {
        expect(configurationResult).toEqual(
          expect.objectContaining({
            initializationStatus: 0,
          })
        );
      });

      it('should invoke `reconfigure` on all adapters', () => {
        expect(memoryAdapterReconfigureSpy).toHaveBeenCalledWith(
          { user },
          expect.anything()
        );
        expect(localstorageAdapterReconfigureSpy).toHaveBeenCalledWith(
          {
            user,
          },
          expect.anything()
        );
      });
    });
  });

  describe('when not all configured sucessfully', () => {
    const failingAdapter = {
      id: 'failing',
      configure: async () => ({
        initializationStatus: AdapterInitializationStatus.Failed,
      }),
    };

    beforeAll(() => {
      adapter.combine([memoryAdapter, failingAdapter]);
    });

    let configurationResult;

    beforeEach(async () => {
      configurationResult = await adapter.configure(
        adapterArgs,
        adapterEventHandlers
      );
    });

    it('should resolve to a failed initialization status', () => {
      expect(configurationResult).toEqual(
        expect.objectContaining({
          initializationStatus: 1,
        })
      );
    });

    it('should indicate that the adapter is configured regardless', () => {
      expect(
        adapter.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
      ).toBe(true);
    });
  });

  describe('when resetting', () => {
    beforeEach(() => {
      adapterEventHandlers.onFlagsStateChange.mockClear();

      adapter.reset();
    });

    it('should invoke not `onFlagsStateChange`', () => {
      expect(adapterEventHandlers.onFlagsStateChange).not.toHaveBeenCalled();
    });

    it('should reset the configuration status', () => {
      expect(
        adapter.getIsConfigurationStatus(
          AdapterConfigurationStatus.Unconfigured
        )
      ).toBe(true);
    });
  });
});

describe('exposeGlobally', () => {
  it('should expose `adapter` globally', () => {
    const global = getGlobalThis();

    expect(global).toHaveProperty('__flopflip__.combined', adapter);
  });
});
