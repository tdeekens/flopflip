import warning from 'tiny-warning';
import adapter, { updateFlags, STORAGE_SLICE } from './adapter';

jest.mock('tiny-warning');

const createAdapterEventHandlers = (custom = {}) => ({
  onFlagsStateChange: jest.fn(),
  onStatusStateChange: jest.fn(),
  ...custom,
});
const AdapterStatus = {
  Unconfigured: 0,
  Configuring: 1,
  Configured: 2,
};

describe('when configuring', () => {
  let adapterArgs = {};
  let adapterEventHandlers = createAdapterEventHandlers();

  describe('when not configured', () => {
    it('should indicate that the adapter is not configured', () => {
      expect(adapter.getIsConfigurationStatus(AdapterStatus.Configured)).toBe(
        false
      );
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
    beforeEach(() => adapter.configure(adapterArgs, adapterEventHandlers));

    it('should invoke `onStatusStateChange` with configuring', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          configurationStatus: AdapterStatus.Configuring,
        })
      );
    });

    it('should indicate that the adapter is configured', () => {
      expect(adapter.getIsConfigurationStatus(AdapterStatus.Configured)).toBe(
        true
      );
    });

    it('should invoke `onStatusStateChange` with configured', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          configurationStatus: AdapterStatus.Configured,
        })
      );
    });

    it('should resolve `waitUntilConfigured`', async () => {
      await expect(adapter.waitUntilConfigured()).resolves.not.toBeDefined();
    });

    it('should invoke `onStatusStateChange`', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalled();
    });

    it('should invoke `onStatusStateChange` with configuring', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          configurationStatus: AdapterStatus.Configuring,
        })
      );
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
    });

    describe('when reconfiguring', () => {
      const user = { id: 'bar' };

      beforeEach(() => {
        updateFlags({ foo: 'bar' });

        return adapter.reconfigure({ user });
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
            configurationStatus: AdapterStatus.Configuring,
          })
        );
      });

      it('should invoke `onStatusStateChange` with configured', () => {
        expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
          expect.objectContaining({
            configurationStatus: AdapterStatus.Configured,
          })
        );
      });
    });
  });
});
