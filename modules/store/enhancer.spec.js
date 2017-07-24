import { initialize, listen } from './../utils/ld-wrapper';
import createFlopFlipEnhancer from './enhancer';

jest.mock('./../utils/ld-wrapper', () => ({
  initialize: jest.fn(),
  listen: jest.fn(),
}));

const clientSideId = '123-abc';
const user = { key: 'foo-user' };

describe('when creating enhancer', () => {
  let enhancer;
  beforeEach(() => {
    enhancer = createFlopFlipEnhancer(clientSideId, user);
  });

  it('should initialize the `ld-wrapper` with `clientSideId` and `user`', () => {
    expect(initialize).toHaveBeenCalledWith({ clientSideId, user });
  });

  describe('with enhanced store', () => {
    let dispatch;

    beforeEach(() => {
      dispatch = jest.fn();

      const getState = () => ({});
      const next = jest.fn(() => ({ getState, dispatch }));
      const args = [''];

      createFlopFlipEnhancer(clientSideId, user);
      enhancer(next)(args);
    });

    it('should `listen` on `ld-wrapper`', () => {
      expect(listen).toHaveBeenCalled();
    });
  });
});
