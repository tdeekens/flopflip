import { AdapterConfigurationStatus } from '@flopflip/types';
import getGlobalThis from 'globalthis';
import warning from 'tiny-warning';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { adapter, STORAGE_SLICE } from '../src/adapter';

vi.mock('tiny-warning');

const createAdapterEventHandlers = (custom = {}) => ({
  onFlagsStateChange: vi.fn(),
  onStatusStateChange: vi.fn(),
  ...custom,
});

describe('when configuring', () => {
  const adapterArgs = { user: { key: 'user-id' } };
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
        adapter.updateFlags({ attempted: 'flagUpdate' });
      });

      it('should invoke and trigger `warning`', () => {
        expect(warning).toHaveBeenCalledWith(false, expect.any(String));
      });
    });
  });

  describe('when configured', () => {
    let configurationResult;
    beforeEach(async () => {
      vi.useFakeTimers();
      configurationResult = await adapter.configure(
        adapterArgs,
        adapterEventHandlers
      );
    });

    afterEach(() => {
      vi.clearAllTimers();
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

    it('should invoke `onStatusStateChange` with configured', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith({
        id: adapter.id,
        status: expect.objectContaining({
          configurationStatus: AdapterConfigurationStatus.Configured,
        }),
      });
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

        adapter.updateFlags(updatedFlags);
      });

      it('should set localstorage', () => {
        expect(
          JSON.parse(
            localStorage.getItem(
              `${STORAGE_SLICE}/${adapterArgs.user.key}/flags`
            )
          )
        ).toStrictEqual(updatedFlags);
      });

      it('should invoke but not trigger `warning`', () => {
        expect(warning).toHaveBeenCalledWith(true, expect.any(String));
      });

      it('should invoke `onFlagsStateChange`', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
      });

      it('should invoke `onFlagsStateChange` with `updatedFlags`', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
          id: adapter.id,
          flags: updatedFlags,
        });
      });

      describe('when flags are not normalized', () => {
        const nonNormalizedUpdatedFlags = {
          'flag-a-1': false,
          flag_b: null,
        };
        beforeEach(() => {
          // From `configure`
          adapterEventHandlers.onFlagsStateChange.mockClear();

          adapter.updateFlags(nonNormalizedUpdatedFlags);
        });

        it('should invoke `onFlagsStateChange`', () => {
          expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
            id: adapter.id,
            flags: expect.objectContaining({
              flagA1: false,
              flagB: false,
            }),
          });
        });
      });

      describe('when flag is locked', () => {
        beforeEach(() => {
          adapterEventHandlers.onFlagsStateChange.mockClear();

          adapter.updateFlags(updatedFlags, { lockFlags: true });

          adapter.updateFlags({ fooFlag: false });
        });

        it('should not update the locked flag', () => {
          expect(
            JSON.parse(
              localStorage.getItem(
                `${STORAGE_SLICE}/${adapterArgs.user.key}/flags`
              )
            )
          ).toHaveProperty('fooFlag', true);
        });
      });
    });

    describe('when localstorage changes', () => {
      const initialFlags = { fooFlag: false, barFlag: false };
      const updatedFlags = { fooFlag: true, barFlag: false };

      beforeEach(() => {
        adapter.updateFlags(initialFlags);
        adapterEventHandlers.onFlagsStateChange.mockClear();

        localStorage.setItem(
          `${STORAGE_SLICE}/${adapterArgs.user.key}/flags`,
          JSON.stringify(updatedFlags)
        );
      });

      it('should invoke `onFlagsStateChange`', () => {
        vi.advanceTimersByTime(5 * 60 * 1000);
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledTimes(
          1
        );
      });
    });

    describe('when localstorage has no changes', () => {
      const initialFlags = { fooFlag: false, barFlag: false };

      beforeEach(() => {
        adapter.updateFlags(initialFlags);
        adapterEventHandlers.onFlagsStateChange.mockClear();
      });

      it('should not invoke `onFlagsStateChange`', () => {
        vi.advanceTimersByTime(5 * 60 * 1000);
        expect(adapterEventHandlers.onFlagsStateChange).not.toHaveBeenCalled();
      });
    });

    describe('when reconfiguring', () => {
      const user = { key: 'bar' };

      beforeEach(async () => {
        adapter.updateFlags({ foo: 'bar' });

        localStorage.setItem(
          `${STORAGE_SLICE}/${user.key}/flags`,
          JSON.stringify({ foo: 'bar' })
        );

        configurationResult = await adapter.reconfigure({ user });
      });

      it('should resolve to a successful initialization status', () => {
        expect(configurationResult).toEqual(
          expect.objectContaining({
            initializationStatus: 0,
          })
        );
      });

      it('should restore flags from localstorage', () => {
        expect(localStorage.getItem).toHaveBeenCalledWith(
          `${STORAGE_SLICE}/${user.key}/flags`
        );
      });

      it('should invoke `onFlagsStateChange`', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
      });

      it('should invoke `onFlagsStateChange` with empty flags', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
          id: adapter.id,
          flags: {},
        });
      });

      it('should invoke `onStatusStateChange` with configuring', () => {
        expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith({
          id: adapter.id,
          status: expect.objectContaining({
            configurationStatus: AdapterConfigurationStatus.Configuring,
          }),
        });
      });

      it('should invoke `onStatusStateChange` with configured', () => {
        expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith({
          id: adapter.id,
          status: expect.objectContaining({
            configurationStatus: AdapterConfigurationStatus.Configured,
          }),
        });
      });
    });
  });
});

describe('exposeGlobally', () => {
  it('should expose `adapter` globally', () => {
    const global = getGlobalThis();

    expect(global).toHaveProperty('__flopflip__.localstorage', adapter);
  });
});
