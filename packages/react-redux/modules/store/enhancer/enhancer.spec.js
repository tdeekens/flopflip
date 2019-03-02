import { updateFlags, updateStatus } from '../../ducks';
import createFlopFlipEnhancer from './enhancer';

const adapterArgs = {
  clientSideId: '123-abc',
  user: { key: 'foo-user' },
};
const adapter = {
  configure: jest.fn(),
  reconfigure: jest.fn(),
};

describe('when creating enhancer', () => {
  let enhancer;
  beforeEach(() => {
    enhancer = createFlopFlipEnhancer(adapter, adapterArgs);
  });

  describe('with enhanced store', () => {
    let dispatch;

    beforeEach(() => {
      dispatch = jest.fn();

      const getState = () => ({});
      const next = jest.fn(() => ({ getState, dispatch }));
      const args = [''];

      enhancer(next)(args);
    });

    it('should invoke `configure` on `adapter`', () => {
      expect(adapter.configure).toHaveBeenCalled();
    });

    it('should invoke `configure` on `adapter` with `adapterArgs`', () => {
      expect(adapter.configure).toHaveBeenCalledWith(
        expect.objectContaining(adapterArgs)
      );
    });

    it('should invoke `configure` on `adapter` with `onFlagsStateChange`', () => {
      expect(adapter.configure).toHaveBeenCalledWith(
        expect.objectContaining({
          onFlagsStateChange: expect.any(Function),
        })
      );
    });

    it('should invoke `configure` on `adapter` with `onStatusStateChange`', () => {
      expect(adapter.configure).toHaveBeenCalledWith(
        expect.objectContaining({
          onStatusStateChange: expect.any(Function),
        })
      );
    });

    describe('when invoking  `onFlagsStateChange`', () => {
      let nextFlags = {
        foo: true,
      };

      beforeEach(() => {
        const { onFlagsStateChange } = adapter.configure.mock.calls[
          adapter.configure.mock.calls.length - 1
        ][0];

        onFlagsStateChange(nextFlags);
      });

      it('should invoke `dispatch`', () => {
        expect(dispatch).toHaveBeenCalled();
      });

      it('should invoke `dispatch` with `updateFlags`', () => {
        expect(dispatch).toHaveBeenCalledWith(updateFlags(nextFlags));
      });
    });

    describe('when invoking  `onStatusStateChange`', () => {
      let nextStatus = {
        isReady: true,
      };

      beforeEach(() => {
        const { onStatusStateChange } = adapter.configure.mock.calls[
          adapter.configure.mock.calls.length - 1
        ][0];

        onStatusStateChange(nextStatus);
      });

      it('should invoke `dispatch`', () => {
        expect(dispatch).toHaveBeenCalled();
      });

      it('should invoke `dispatch` with `updateStatus`', () => {
        expect(dispatch).toHaveBeenCalledWith(updateStatus(nextStatus));
      });
    });
  });
});
