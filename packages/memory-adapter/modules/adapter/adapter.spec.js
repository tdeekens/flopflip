import ldClient from 'ldclient-js';
import adapter, { getUser, updateFlags } from './adapter';

const createAdapterArgs = (customArgs = {}) => ({
  user: { id: 'foo' },
  onFlagsStateChange: jest.fn(),
  onStatusStateChange: jest.fn(),

  ...customArgs,
});

describe('when configuring', () => {
  let adapterArgs = createAdapterArgs();

  beforeEach(() => adapter.configure(adapterArgs));

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

  describe('when updating flags', () => {
    const updatedFlags = { fooFlag: true, barFlag: false };

    beforeEach(() => {
      // From `configure`
      adapterArgs.onFlagsStateChange.mockClear();

      updateFlags(updatedFlags);
    });

    it('should invoke `onFlagsStateChange`', () => {
      expect(adapterArgs.onFlagsStateChange).toHaveBeenCalled();
    });

    it('should invoke `onFlagsStateChange` with `updatedFlags`', () => {
      expect(adapterArgs.onFlagsStateChange).toHaveBeenCalledWith(updatedFlags);
    });
  });
});
