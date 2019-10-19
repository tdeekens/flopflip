import invariant from 'invariant';
import adapter, { getUser, updateFlags } from './adapter';

jest.mock('invariant');

const createAdapterArgs = (customArgs = {}) => ({
  user: { id: 'foo' },
  onFlagsStateChange: jest.fn(),
  onStatusStateChange: jest.fn(),

  ...customArgs,
});

describe('when configuring', () => {
  const updatedFlags = { fooFlag: true, barFlag: false };
  let adapterArgs;

  beforeEach(() => {
    invariant.mockClear();
    adapterArgs = createAdapterArgs();
  });

  it('should indicate that the adapter is not ready', () => {
    expect(adapter.getIsReady()).toBe(false);
  });

  describe('updating flags', () => {
    beforeEach(() => {
      updateFlags({ attempted: 'flagUpdate' });
    });

    it('should invoke and trigger `invariant`', () => {
      expect(invariant).toHaveBeenCalledWith(false, expect.any(String));
    });
  });

  describe('when configured', () => {
    beforeEach(() => adapter.configure(adapterArgs));

    it('should indicate that the adapter is ready', () => {
      expect(adapter.getIsReady()).toBe(true);
    });

    it('should invoke `onStatusStateChange`', () => {
      expect(adapterArgs.onStatusStateChange).toHaveBeenCalled();
    });

    it('should resolve `waitUntilConfigured`', async () => {
      await expect(adapter.waitUntilConfigured()).resolves.not.toBeDefined();
    });

    it('should invoke `onStatusStateChange` with `isReady`', () => {
      expect(adapterArgs.onStatusStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isReady: true,
        })
      );
    });

    it('should invoke `onStatusStateChange` with `isConfigured`', () => {
      expect(adapterArgs.onStatusStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          isConfigured: true,
        })
      );
    });

    it('should invoke `onFlagsStateChange`', () => {
      expect(adapterArgs.onFlagsStateChange).toHaveBeenCalled();
    });

    describe('when updating flags', () => {
      beforeEach(() => {
        // From `configure`
        adapterArgs.onFlagsStateChange.mockClear();

        updateFlags(updatedFlags);
      });

      it('should invoke but not trigger `invariant`', () => {
        expect(invariant).toHaveBeenCalledWith(true, expect.any(String));
      });

      it('should invoke `onFlagsStateChange`', () => {
        expect(adapterArgs.onFlagsStateChange).toHaveBeenCalled();
      });

      it('should invoke `onFlagsStateChange` with `updatedFlags`', () => {
        expect(adapterArgs.onFlagsStateChange).toHaveBeenCalledWith(
          expect.objectContaining(updatedFlags)
        );
      });

      describe('when flags are not normalized', () => {
        const nonNormalizedUpdatedFlags = {
          'flag-a-1': false,
          // eslint-disable-next-line @typescript-eslint/camelcase
          flag_b: null,
        };
        beforeEach(() => {
          // From `configure`
          adapterArgs.onFlagsStateChange.mockClear();

          updateFlags(nonNormalizedUpdatedFlags);
        });

        it('should invoke `onFlagsStateChange`', () => {
          expect(adapterArgs.onFlagsStateChange).toHaveBeenCalled();
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
        expect(adapterArgs.onFlagsStateChange).toHaveBeenCalled();
      });

      it('should invoke `onFlagsStateChange` with empty flags', () => {
        expect(adapterArgs.onFlagsStateChange).toHaveBeenCalledWith({});
      });
    });

    describe('when resetting', () => {
      beforeEach(() => {
        updateFlags(updatedFlags);

        adapterArgs.onFlagsStateChange.mockClear();

        adapter.reset();
      });

      it('should invoke not `onFlagsStateChange`', () => {
        expect(adapterArgs.onFlagsStateChange).not.toHaveBeenCalled();
      });

      it('should reset the flags', () => {
        expect(adapter.getFlag(updatedFlags.fooFlag)).not.toBeDefined();
        expect(adapter.getFlag(updatedFlags.barFlag)).not.toBeDefined();
      });
    });

    describe('when setting ready state', () => {
      beforeEach(() => {
        adapterArgs.onStatusStateChange.mockClear();

        adapter.setIsReady({ isReady: false });
      });

      it('should indicate that the adapter is not ready', () => {
        expect(adapter.getIsReady()).toBe(false);
      });

      it('should invoke `onStatusStateChange` with `isReady`', () => {
        expect(adapterArgs.onStatusStateChange).toHaveBeenCalledWith(
          expect.objectContaining({
            isReady: false,
          })
        );
      });
    });
  });
});
