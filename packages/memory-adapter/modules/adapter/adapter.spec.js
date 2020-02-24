import { TAdapterConfigurationStatus } from '@flopflip/types';
import warning from 'tiny-warning';
import adapter, { getUser, updateFlags } from './adapter';

jest.mock('tiny-warning');

const createAdapterArgs = (customArgs = {}) => ({
  user: { id: 'foo' },
  onFlagsStateChange: jest.fn(),
  onStatusStateChange: jest.fn(),
  ...customArgs,
});
const createAdapterEventHandlers = (custom = {}) => ({
  onFlagsStateChange: jest.fn(),
  onStatusStateChange: jest.fn(),
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
      adapter.getIsConfigurationStatus(TAdapterConfigurationStatus.Configured)
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

  describe('when configured', () => {
    beforeEach(() => adapter.configure(adapterArgs, adapterEventHandlers));

    it('should invoke `onStatusStateChange` with configuring', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          configurationStatus: TAdapterConfigurationStatus.Configuring,
        })
      );
    });

    it('should indicate that the adapter is configured', () => {
      expect(
        adapter.getIsConfigurationStatus(TAdapterConfigurationStatus.Configured)
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
          configurationStatus: TAdapterConfigurationStatus.Configured,
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

        updateFlags(updatedFlags);
      });

      it('should invoke but not trigger `warning`', () => {
        expect(warning).toHaveBeenCalledWith(true, expect.any(String));
      });

      it('should invoke `onFlagsStateChange`', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
      });

      it('should invoke `onFlagsStateChange` with `updatedFlags`', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith(
          expect.objectContaining(updatedFlags)
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
          expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
        });

        it('should normalise all flag names and values', () => {
          expect(adapter.getFlag('flagA1')).toEqual(false);
          expect(adapter.getFlag('flagB')).toEqual(false);
        });
      });
    });

    describe('when reconfiguring', () => {
      const user = { id: 'bar' };

      beforeEach(() => adapter.reconfigure({ user }));

      it('should update the user', () => {
        expect(getUser()).toEqual(user);
      });

      it('should invoke `onFlagsStateChange`', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
      });

      it('should invoke `onFlagsStateChange` with empty flags', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith(
          {}
        );
      });
    });

    describe('when resetting', () => {
      beforeEach(() => {
        updateFlags(updatedFlags);

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

        adapter.setConfigurationStatus(TAdapterConfigurationStatus.Configuring);
      });

      it('should invoke `onStatusStateChange` with configuring', () => {
        expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
          expect.objectContaining({
            configurationStatus: TAdapterConfigurationStatus.Configuring,
          })
        );
      });

      it('should indicate that the adapter is not configured', () => {
        expect(
          adapter.getIsConfigurationStatus(
            TAdapterConfigurationStatus.Configured
          )
        ).toBe(false);
      });

      it('should invoke `onStatusStateChange` with configured', () => {
        expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
          expect.objectContaining({
            configurationStatus: TAdapterConfigurationStatus.Configuring,
          })
        );
      });
    });
  });
});
