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
      dispatch = jest.fn(() => jest.fn());

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

    it('should invoke `configure` on `adapter` with `onUpdateFlags`', () => {
      expect(adapter.configure).toHaveBeenCalledWith(
        expect.objectContaining({
          onUpdateFlags: expect.any(Function),
        })
      );
    });

    it('should invoke `configure` on `adapter` with `onUpdateStatus`', () => {
      expect(adapter.configure).toHaveBeenCalledWith(
        expect.objectContaining({
          onUpdateStatus: expect.any(Function),
        })
      );
    });
  });
});
