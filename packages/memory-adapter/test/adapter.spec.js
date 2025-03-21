import { AdapterConfigurationStatus } from '@flopflip/types';
import getGlobalThis from 'globalthis';
import warning from 'tiny-warning';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adapter } from '../src/adapter';

vi.mock('tiny-warning');

const createAdapterArgs = (customArgs = {}) => ({
  user: { id: 'foo' },
  ...customArgs,
});
const createAdapterEventHandlers = (custom = {}) => ({
  onFlagsStateChange: vi.fn(),
  onStatusStateChange: vi.fn(),
  ...custom,
});

describe('when configuring', () => {
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

  describe('updating flags', () => {
    beforeEach(() => {
      adapter.updateFlags({ attempted: 'flagUpdate' });
    });

    it('should invoke and trigger `warning`', () => {
      expect(warning).toHaveBeenCalledWith(false, expect.any(String));
    });
  });

  describe('when configured', () => {
    let configurationResult;

    beforeEach(async () => {
      configurationResult = await adapter.configure(
        adapterArgs,
        adapterEventHandlers
      );
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

    describe('when updating flags', () => {
      beforeEach(() => {
        // From `configure`
        adapterEventHandlers.onFlagsStateChange.mockClear();

        adapter.updateFlags(updatedFlags);
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
          flags: expect.objectContaining(updatedFlags),
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
          expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
        });

        it('should normalise all flag names and values', () => {
          expect(adapter.getFlag('flagA1')).toEqual(false);
          expect(adapter.getFlag('flagB')).toEqual(false);
        });
      });

      describe('when flag is locked', () => {
        beforeEach(() => {
          adapterEventHandlers.onFlagsStateChange.mockClear();

          adapter.updateFlags(updatedFlags, { lockFlags: true });

          adapter.updateFlags({ fooFlag: false });
        });

        it('should not update the locked flag', () => {
          expect(adapter.getFlag('fooFlag')).toEqual(true);
        });
      });
    });

    describe('when reconfiguring', () => {
      const user = { id: 'bar' };

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

      it('should update the user', () => {
        expect(adapter.getUser()).toEqual(user);
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
    });

    describe('when resetting', () => {
      beforeEach(() => {
        adapter.updateFlags(updatedFlags);

        adapterEventHandlers.onFlagsStateChange.mockClear();

        adapter.reset();
      });

      it('should invoke not `onFlagsStateChange`', () => {
        expect(adapterEventHandlers.onFlagsStateChange).not.toHaveBeenCalled();
      });

      it('should reset the flags', () => {
        expect(adapter.getFlag(updatedFlags.fooFlag)).not.toBeDefined();
        expect(adapter.getFlag(updatedFlags.barFlag)).not.toBeDefined();
      });
    });

    describe('when setting configuration status to configuring', () => {
      beforeEach(() => {
        adapterEventHandlers.onStatusStateChange.mockClear();

        adapter.setConfigurationStatus(AdapterConfigurationStatus.Configuring);
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

      it('should indicate that the adapter is not configured', () => {
        expect(
          adapter.getIsConfigurationStatus(
            AdapterConfigurationStatus.Configured
          )
        ).toBe(false);
      });

      it('should invoke `onStatusStateChange` with configured', () => {
        expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
          expect.objectContaining({
            id: adapter.id,
            status: {
              configurationStatus: AdapterConfigurationStatus.Configuring,
            },
          })
        );
      });
    });
  });
});

describe('exposeGlobally', () => {
  it('should expose `adapter` globally', () => {
    const global = getGlobalThis();

    expect(global).toHaveProperty('__flopflip__.memory', adapter);
  });
});
