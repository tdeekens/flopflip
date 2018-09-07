import ldClient from 'ldclient-js';
import invariant from 'invariant';
import adapter, { updateFlags, STORAGE_SLICE } from './adapter';

jest.mock('invariant');

const createAdapterArgs = (customArgs = {}) => ({
  onFlagsStateChange: jest.fn(),
  onStatusStateChange: jest.fn(),

  ...customArgs,
});

describe('when configuring', () => {
  let adapterArgs = createAdapterArgs();

  describe('when not configured', () => {
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
  });

  describe('when configured', () => {
    beforeEach(() => adapter.configure(adapterArgs));

    it('should indicate that the adapter is ready', () => {
      expect(adapter.getIsReady()).toBe(true);
    });

    it('should resolve `waitUntilConfigured`', async () => {
      await expect(adapter.waitUntilConfigured()).resolves.not.toBeDefined();
    });

    it('should invoke `onStatusStateChange`', () => {
      expect(adapterArgs.onStatusStateChange).toHaveBeenCalled();
    });

    it('should invoke `onStatusStateChange` with `isReady`', () => {
      expect(adapterArgs.onStatusStateChange).toHaveBeenCalledWith({
        isReady: true,
      });
    });

    it('should invoke `onFlagsStateChange`', () => {
      expect(adapterArgs.onFlagsStateChange).toHaveBeenCalled();
    });

    describe('when updating flags', () => {
      const updatedFlags = { fooFlag: true, barFlag: false };

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
          updatedFlags
        );
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
        expect(adapterArgs.onFlagsStateChange).toHaveBeenCalled();
      });

      it('should invoke `onFlagsStateChange` with empty flags', () => {
        expect(adapterArgs.onFlagsStateChange).toHaveBeenCalledWith({});
      });
    });
  });
});
