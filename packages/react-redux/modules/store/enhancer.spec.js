import { initialize, listen } from '@flopflip/launchdarkly-wrapper';
import createFlopFlipEnhancer from './enhancer';

jest.mock('@flopflip/launchdarkly-wrapper', () => ({
  initialize: jest.fn(),
  listen: jest.fn(),
}));

const client = { __client__: '__internal__' };
const clientSideId = '123-abc';
const user = { key: 'foo-user' };

describe('when creating enhancer', () => {
  let enhancer;
  beforeEach(() => {
    initialize.mockReturnValue(client);

    enhancer = createFlopFlipEnhancer(clientSideId, user);
  });

  it('should initialize the `launchdarkly-wrapper` with `clientSideId` and `user`', () => {
    expect(initialize).toHaveBeenCalledWith({ clientSideId, user });
  });

  describe('with enhanced store', () => {
    let dispatch;

    beforeEach(() => {
      dispatch = jest.fn(() => jest.fn());

      const getState = () => ({});
      const next = jest.fn(() => ({ getState, dispatch }));
      const args = [''];

      createFlopFlipEnhancer(clientSideId, user);
      enhancer(next)(args);
    });

    it('should `listen` on `launchdarkly-wrapper`', () => {
      expect(listen).toHaveBeenCalled();
    });

    it('should `listen` with `client`, `updateFlags` and `updateStatus`', () => {
      expect(listen).toHaveBeenCalledWith({
        client,
        updateFlags: expect.any(Function),
        updateStatus: expect.any(Function),
      });
    });
  });
});
