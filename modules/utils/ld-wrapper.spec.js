import ldClient from 'ldclient-js';
import { UPDATE_STATUS, UPDATE_FLAGS } from './../ducks';
import { initialize, listen } from './ld-wrapper';

jest.mock('ldclient-js', () => ({
  initialize: jest.fn(() => ({
    on: jest.fn(),
    allFlags: jest.fn(),
  })),
}));

const clientSideId = '123-abc';
const user = { key: 'foo-user' };

describe('when initializing', () => {
  beforeEach(() => {
    initialize({ clientSideId, user });
  });

  it('should initialize the `ld-client` with `clientSideId` and `user`', () => {
    expect(ldClient.initialize).toHaveBeenCalledWith(clientSideId, user);
  });

  describe('when ready', () => {
    const flags = { 'some-flag-1': true, 'some-flag-2': false };
    let dispatch;
    let client;

    beforeEach(() => {
      client = {
        allFlags: jest.fn(() => flags),
        on: jest.fn((_, cb) => cb()),
      };
      dispatch = jest.fn();

      listen({ client, dispatch });
    });

    describe('when `ldClient` is ready', () => {
      it('should `dispatch` `updateStatus` action', () => {
        expect(dispatch).toHaveBeenCalledWith({
          type: UPDATE_STATUS,
          payload: expect.any(Object),
        });
      });

      it('should `dispatch` `updateStatus` action with `isReady`', () => {
        expect(dispatch).toHaveBeenCalledWith({
          type: expect.any(String),
          payload: { isReady: true },
        });
      });

      it('should `dispatch` `updateFlags` action', () => {
        expect(dispatch).toHaveBeenCalledWith({
          type: UPDATE_FLAGS,
          payload: expect.any(Object),
        });
      });

      it('should `dispatch` `updateFlags` action with camel cased `flags`', () => {
        expect(dispatch).toHaveBeenCalledWith({
          type: expect.any(String),
          payload: {
            someFlag1: true,
            someFlag2: false,
          },
        });
      });

      it('should register callbacks to receive flag updates', () => {
        expect(client.on).toHaveBeenCalledWith(
          `change:some-flag-1`,
          expect.any(Function)
        );

        expect(client.on).toHaveBeenCalledWith(
          `change:some-flag-2`,
          expect.any(Function)
        );
      });
    });

    describe('when flag updates', () => {
      beforeEach(() => {
        // Reset due to preivous dispatches
        dispatch.mockClear();

        // Checking for change:* callbacks and settings all flags
        // to false.
        client.on.mock.calls.forEach(([event, cb]) => {
          if (event.startsWith('change:')) cb(false);
        });
      });

      it('should `dispatch` `updateFlags` action', () => {
        expect(dispatch).toHaveBeenCalledWith({
          type: UPDATE_FLAGS,
          payload: expect.any(Object),
        });
      });

      it('should `dispatch` `updateFlags` action with camel cased `flags`', () => {
        expect(dispatch).toHaveBeenCalledWith({
          type: expect.any(String),
          payload: {
            someFlag1: false,
          },
        });
        expect(dispatch).toHaveBeenCalledWith({
          type: expect.any(String),
          payload: {
            someFlag2: false,
          },
        });
      });
    });
  });
});
