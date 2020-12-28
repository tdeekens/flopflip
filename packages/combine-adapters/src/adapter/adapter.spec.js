import warning from 'tiny-warning';
import getGlobalThis from 'globalthis';
import { AdapterConfigurationStatus } from '@flopflip/types';
import memoryAdapter from '@flopflip/memory-adapter';
import localstorageAdapter from '@flopflip/localstorage-adapter';
import adapter from './adapter';
import { beforeAll } from 'globalthis/implementation';

jest.mock('tiny-warning');

const createAdapterArgs = (customArgs = {}) => ({
  user: { id: 'foo' },
  ...customArgs,
});
const createAdapterEventHandlers = (custom = {}) => ({
  onFlagsStateChange: jest.fn(),
  onStatusStateChange: jest.fn(),
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

  beforeAll(() => {
    adapter.combine([memoryAdapter, localstorageAdapter]);
  });

  it('should indicate that the adapter is not configured', () => {
    expect(
      adapter.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
    ).toBe(false);
  });

  describe('when configured', () => {
    let configurationResult;

    const memoryAdapterConfigureSpy = jest.spyOn(memoryAdapter, 'configure');
    const localstorageAdapterConfigureSpy = jest.spyOn(
      memoryAdapter,
      'configure'
    );

    beforeEach(async () => {
      configurationResult = await adapter.configure(
        adapterArgs,
        adapterEventHandlers
      );
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
      expect(memoryAdapterConfigureSpy).toHaveBeenCalled();
      expect(localstorageAdapterConfigureSpy).toHaveBeenCalled();
    });

    it('should invoke `onStatusStateChange`', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalled();
    });

    it('should resolve `waitUntilConfigured`', async () => {
      await expect(adapter.waitUntilConfigured()).resolves.not.toBeDefined();
    });

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

    it('should invoke `onFlagsStateChange`', () => {
      expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
    });

    describe('when updating flags of a used adapter', () => {
      beforeEach(() => {
        // From `configure`
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

    describe('when reconfiguring', () => {
      const user = { id: 'bar' };

      const memoryAdapterReconfigureSpy = jest.spyOn(
        memoryAdapter,
        'reconfigure'
      );
      const localstorageAdapterReconfigureSpy = jest.spyOn(
        memoryAdapter,
        'reconfigure'
      );

      beforeEach(async () => {
        configurationResult = await adapter.reconfigure({ user });
      });

      it('should resolve to a successful initialization status', () => {
        expect(configurationResult).toEqual(
          expect.objectContaining({
            initializationStatus: 0,
          })
        );
      });

      it('should invoke `reconfigure` on all adapters', () => {
        expect(memoryAdapterReconfigureSpy).toHaveBeenCalled();
        expect(localstorageAdapterReconfigureSpy).toHaveBeenCalled();
      });
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
    const globalThis = getGlobalThis();

    expect(globalThis).toHaveProperty('__flopflip__.combined', adapter);
  });
});
