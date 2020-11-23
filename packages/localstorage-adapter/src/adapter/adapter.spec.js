import { AdapterConfigurationStatus } from '@flopflip/types';
import warning from 'tiny-warning';
import getGlobalThis from 'globalthis';
import adapter, { updateFlags, STORAGE_SLICE } from './adapter';

jest.mock('tiny-warning');

const createAdapterEventHandlers = (custom = {}) => ({
  onFlagsStateChange: jest.fn(),
  onStatusStateChange: jest.fn(),
  ...custom,
});

describe('when configuring', () => {
  let adapterArgs = {};
  let adapterEventHandlers;

  beforeEach(() => {
    adapterEventHandlers = createAdapterEventHandlers();
  });

  describe('when not configured', () => {
    it('should indicate that the adapter is not configured', () => {
      expect(
        adapter.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
      ).toBe(false);
    });

    describe('updating flags', () => {
      beforeEach(() => {
        updateFlags({ attempted: 'flagUpdate' });
      });

      it('should invoke and trigger `warning`', () => {
        expect(warning).toHaveBeenCalledWith(false, expect.any(String));
      });
    });
  });

  describe('when configured', () => {
    let configurationResult;
    beforeEach(async () => {
      jest.useFakeTimers();
      configurationResult = await adapter.configure(
        adapterArgs,
        adapterEventHandlers
      );
    });

    afterEach(() => {
      jest.clearAllTimers();
    });

    it('should resolve to a successful initialization status', () => {
      expect(configurationResult).toEqual(
        expect.objectContaining({
          initializationStatus: 0,
        })
      );
    });

    it('should invoke `onStatusStateChange` with configuring', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          configurationStatus: AdapterConfigurationStatus.Configuring,
        })
      );
    });

    it('should indicate that the adapter is configured', () => {
      expect(
        adapter.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
      ).toBe(true);
    });

    it('should invoke `onStatusStateChange` with configured', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          configurationStatus: AdapterConfigurationStatus.Configured,
        })
      );
    });

    it('should resolve `waitUntilConfigured`', async () => {
      await expect(adapter.waitUntilConfigured()).resolves.not.toBeDefined();
    });

    it('should invoke `onStatusStateChange`', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalled();
    });

    it('should invoke `onFlagsStateChange`', () => {
      expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
    });

    describe('when updating flags', () => {
      const updatedFlags = { fooFlag: true, barFlag: false };

      beforeEach(() => {
        // From `configure`
        adapterEventHandlers.onFlagsStateChange.mockClear();

        updateFlags(updatedFlags);
      });

      it('should set localstorage', () => {
        expect(
          JSON.parse(localStorage.getItem(`${STORAGE_SLICE}__flags`))
        ).toStrictEqual(updatedFlags);
      });

      it('should invoke but not trigger `warning`', () => {
        expect(warning).toHaveBeenCalledWith(true, expect.any(String));
      });

      it('should invoke `onFlagsStateChange`', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
      });

      it('should invoke `onFlagsStateChange` with `updatedFlags`', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith(
          updatedFlags
        );
      });

      describe('when flags are not normalized', () => {
        const nonNormalizedUpdatedFlags = {
          'flag-a-1': false,
          flag_b: null,
        };
        beforeEach(() => {
          // From `configure`
          adapterEventHandlers.onFlagsStateChange.mockClear();

          updateFlags(nonNormalizedUpdatedFlags);
        });

        it('should invoke `onFlagsStateChange`', () => {
          expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith(
            expect.objectContaining({
              flagA1: false,
              flagB: false,
            })
          );
        });
      });

      describe('when flag is locked', () => {
        beforeEach(() => {
          adapterEventHandlers.onFlagsStateChange.mockClear();

          updateFlags(updatedFlags, { lockFlags: true });

          updateFlags({ fooFlag: false });
        });

        it('should not update the locked flag', () => {
          expect(
            JSON.parse(localStorage.getItem(`${STORAGE_SLICE}__flags`))
          ).toHaveProperty('fooFlag', true);
        });
      });
    });

    describe('when localstorage changes', () => {
      const initialFlags = { fooFlag: false, barFlag: false };
      const updatedFlags = { fooFlag: true, barFlag: false };

      beforeEach(() => {
        updateFlags(initialFlags);
        adapterEventHandlers.onFlagsStateChange.mockClear();

        localStorage.setItem(
          `${STORAGE_SLICE}__flags`,
          JSON.stringify(updatedFlags)
        );
      });

      it('should invoke `onFlagsStateChange`', () => {
        jest.advanceTimersByTime(5 * 60 * 1000);
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledTimes(
          1
        );
      });
    });

    describe('when localstorage has no changes', () => {
      const initialFlags = { fooFlag: false, barFlag: false };

      beforeEach(() => {
        updateFlags(initialFlags);
        adapterEventHandlers.onFlagsStateChange.mockClear();
      });

      it('should not invoke `onFlagsStateChange`', () => {
        jest.advanceTimersByTime(5 * 60 * 1000);
        expect(adapterEventHandlers.onFlagsStateChange).not.toHaveBeenCalled();
      });
    });

    describe('when reconfiguring', () => {
      const user = { id: 'bar' };

      beforeEach(async () => {
        updateFlags({ foo: 'bar' });

        configurationResult = await adapter.reconfigure({ user });
      });

      it('should resolve to a successful initialization status', () => {
        expect(configurationResult).toEqual(
          expect.objectContaining({
            initializationStatus: 0,
          })
        );
      });

      it('should reset localstorage', () => {
        expect(localStorage.getItem(`${STORAGE_SLICE}__flags`)).toBe(null);
      });

      it('should invoke `onFlagsStateChange`', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
      });

      it('should invoke `onFlagsStateChange` with empty flags', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith(
          {}
        );
      });

      it('should invoke `onStatusStateChange` with configuring', () => {
        expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
          expect.objectContaining({
            configurationStatus: AdapterConfigurationStatus.Configuring,
          })
        );
      });

      it('should invoke `onStatusStateChange` with configured', () => {
        expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
          expect.objectContaining({
            configurationStatus: AdapterConfigurationStatus.Configured,
          })
        );
      });
    });
  });
});

describe('exposeGlobally', () => {
  it('should expose `adapter` globally', () => {
    const globalThis = getGlobalThis();

    expect(globalThis).toHaveProperty(
      '__flopflip__.localstorage.adapter',
      adapter
    );
  });

  it('should expose `updateFlags` globally', () => {
    const globalThis = getGlobalThis();

    expect(globalThis).toHaveProperty(
      '__flopflip__.localstorage.updateFlags',
      updateFlags
    );
  });
});
