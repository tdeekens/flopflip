import ldClient from 'ldclient-js';
import {
  initialize,
  listen,
  camelCaseFlags,
  createAnonymousUser,
  changeUserContext,
} from './client';

jest.mock('nanoid', () => jest.fn(() => 'foo-random-id'));

jest.mock('ldclient-js', () => ({
  initialize: jest.fn(() => ({
    on: jest.fn(),
    allFlags: jest.fn(),
  })),
}));

const clientSideId = '123-abc';
const user = { key: 'foo-user' };

describe('when initializing', () => {
  describe('with user key', () => {
    beforeEach(() => {
      initialize({ clientSideId, user });
    });

    it('should initialize the `ld-client` with `clientSideId` and given `user`', () => {
      expect(ldClient.initialize).toHaveBeenCalledWith(clientSideId, user);
    });
  });

  describe('without key', () => {
    beforeEach(() => {
      initialize({ clientSideId, user: {} });
    });

    it('should initialize the `ld-client` with `clientSideId` and random `user` `key`', () => {
      expect(ldClient.initialize).toHaveBeenCalledWith(clientSideId, {
        key: 'foo-random-id',
      });
    });
  });

  describe('when ready', () => {
    const flags = { 'some-flag-1': true, 'some-flag-2': false };
    let onUpdateStatus;
    let onUpdateFlags;
    let client;

    beforeEach(() => {
      client = {
        allFlags: jest.fn(() => flags),
        on: jest.fn((_, cb) => cb()),
      };
      onUpdateStatus = jest.fn();
      onUpdateFlags = jest.fn();

      listen({ client, onUpdateStatus, onUpdateFlags });
    });

    describe('when `ldClient` is ready', () => {
      it('should `dispatch` `onUpdateStatus` action with `isReady`', () => {
        expect(onUpdateStatus).toHaveBeenCalledWith({
          isReady: true,
        });
      });

      it('should `dispatch` `onUpdateFlags` action with camel cased `flags`', () => {
        expect(onUpdateFlags).toHaveBeenCalledWith({
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
        onUpdateFlags.mockClear();

        // Checking for change:* callbacks and settings all flags
        // to false.
        client.on.mock.calls.forEach(([event, cb]) => {
          if (event.startsWith('change:')) cb(false);
        });
      });

      it('should `dispatch` `onUpdateFlags` action', () => {
        expect(onUpdateFlags).toHaveBeenCalled();
      });

      it('should `dispatch` `onUpdateFlags` action with camel cased `flags`', () => {
        expect(onUpdateFlags).toHaveBeenCalledWith({
          someFlag1: false,
        });
        expect(onUpdateFlags).toHaveBeenCalledWith({
          someFlag2: false,
        });
      });
    });
  });
});

describe('when changing user context', () => {
  let client;

  beforeEach(() => {
    client = { identify: jest.fn() };

    changeUserContext({ client, user });
  });

  it('should invoke `identify` on the `client` with the `user`', () => {
    expect(client.identify).toHaveBeenCalledWith(user);
  });
});

describe('camelCasedFlags', () => {
  describe('with dashes', () => {
    const rawFlags = {
      'a-flag': true,
      'flag-b-c': false,
    };

    it('should camel case to uppercased flag names', () => {
      expect(camelCaseFlags(rawFlags)).toEqual({ aFlag: true, flagBC: false });
    });
  });

  describe('with spaces', () => {
    const rawFlags = {
      'a flag': true,
      'flag b-c': false,
    };

    it('should camel case to uppercased flag names', () => {
      expect(camelCaseFlags(rawFlags)).toEqual({ aFlag: true, flagBC: false });
    });
  });
});

describe('create anonymous user', () => {
  it('should create user with uuid in key property', () => {
    expect(createAnonymousUser().key).toBeDefined();
  });

  it('should create uuid of length `foo-random-id`', () => {
    expect(createAnonymousUser().key.length).toBe(13);
  });
});
