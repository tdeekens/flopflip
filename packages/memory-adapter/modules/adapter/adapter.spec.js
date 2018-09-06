import ldClient from 'ldclient-js';
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

    it('should invoke `onStatusStateChange` with `isReady`', () => {
      expect(adapterArgs.onStatusStateChange).toHaveBeenCalledWith({
        isReady: true,
      });
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
  });
});
