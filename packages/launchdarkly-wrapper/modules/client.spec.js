import ldClient from 'ldclient-js';
import { initialize, listen } from './client';

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
    let updateStatus;
    let updateFlags;
    let client;

    beforeEach(() => {
      client = {
        allFlags: jest.fn(() => flags),
        on: jest.fn((_, cb) => cb()),
      };
      updateStatus = jest.fn();
      updateFlags = jest.fn();

      listen({ client, updateStatus, updateFlags });
    });

    describe('when `ldClient` is ready', () => {
      it('should `dispatch` `updateStatus` action with `isReady`', () => {
        expect(updateStatus).toHaveBeenCalledWith({
          isReady: true,
        });
      });

      it('should `dispatch` `updateFlags` action with camel cased `flags`', () => {
        expect(updateFlags).toHaveBeenCalledWith({
          someFlag1: true,
          someFlag2: false,
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
        updateFlags.mockClear();

        // Checking for change:* callbacks and settings all flags
        // to false.
        client.on.mock.calls.forEach(([event, cb]) => {
          if (event.startsWith('change:')) cb(false);
        });
      });

      it('should `dispatch` `updateFlags` action', () => {
        expect(updateFlags).toHaveBeenCalled();
      });

      it('should `dispatch` `updateFlags` action with camel cased `flags`', () => {
        expect(updateFlags).toHaveBeenCalledWith({
          someFlag1: false,
        });
        expect(updateFlags).toHaveBeenCalledWith({
          someFlag2: false,
        });
      });
    });
  });
});
