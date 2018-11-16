import ldClient from 'ldclient-js';
import warning from 'tiny-warning';
import adapter, { camelCaseFlags, createAnonymousUserKey } from './adapter';

jest.mock('ldclient-js', () => ({
  initialize: jest.fn(),
}));
jest.mock('tiny-warning');

const clientSideId = '123-abc';
const userWithKey = { key: 'foo-user' };
const userWithoutKey = {
  group: 'foo-group',
};
const flags = { 'some-flag-1': true, 'some-flag-2': false };
const createClient = jest.fn(apiOverwrites => ({
  waitUntilReady: jest.fn(() => Promise.resolve()),
  on: jest.fn((_, cb) => cb()),
  allFlags: jest.fn(() => ({})),

  ...apiOverwrites,
}));

describe('when configuring', () => {
  let onStatusStateChange;
  let onFlagsStateChange;

  beforeEach(() => {
    onStatusStateChange = jest.fn();
    onFlagsStateChange = jest.fn();

    ldClient.initialize.mockReturnValue(createClient());
  });

  it('should indicate that the adapter is not ready', () => {
    expect(adapter.getIsReady()).toBe(false);
  });

  describe('when reconfiguring before configured', () => {
    it('should reject reconfiguration', () => {
      return expect(adapter.reconfigure({ user: userWithKey })).rejects.toEqual(
        expect.any(Error)
      );
    });
  });

  describe('when changing user context before configured', () => {
    const updatedUserProps = {
      bar: 'baz',
      foo: 'far',
    };
    let updatingOfUserContext;

    beforeEach(() => {
      updatingOfUserContext = adapter.updateUserContext(updatedUserProps);

      return updatingOfUserContext.catch(() => {});
    });

    it('should reject `updateUserContext`', () => {
      expect(updatingOfUserContext).rejects.toEqual(expect.any(Error));
    });
  });

  describe('with user key', () => {
    beforeEach(() => {
      return adapter.configure({
        clientSideId,
        user: userWithKey,
        onStatusStateChange,
        onFlagsStateChange,
      });
    });

    it('should initialize the `ld-client` with `clientSideId` and given `user`', () => {
      expect(ldClient.initialize).toHaveBeenCalledWith(
        clientSideId,
        userWithKey
      );
    });
  });

  describe('without key', () => {
    beforeEach(() =>
      adapter.configure({
        clientSideId,
        user: userWithoutKey,
        onStatusStateChange,
        onFlagsStateChange,
      })
    );

    it('should initialize the `ld-client` with `clientSideId` and random `user` `key`', () => {
      expect(ldClient.initialize).toHaveBeenCalledWith(clientSideId, {
        key: expect.any(String),
        group: 'foo-group',
      });
    });
  });

  describe('when ready', () => {
    let client;
    let onStatusStateChange;
    let onFlagsStateChange;

    beforeEach(() => {
      onStatusStateChange = jest.fn();
      onFlagsStateChange = jest.fn();
      client = createClient({
        allFlags: jest.fn(() => flags),
      });

      ldClient.initialize.mockReturnValue(client);

      return adapter.configure({
        clientSideId,
        user: userWithKey,
        onStatusStateChange,
        onFlagsStateChange,
      });
    });

    describe('when `ldClient` is ready', () => {
      describe('when determining if adapter is ready', () => {
        it('should indicate that the adapter is ready', () => {
          expect(adapter.getIsReady()).toBe(true);
        });
      });

      it('should `dispatch` `onUpdateStatus` action with `isReady`', () => {
        expect(onStatusStateChange).toHaveBeenCalledWith({
          isReady: true,
        });
      });

      it('should `dispatch` `onStatusStateChange`', () => {
        expect(onFlagsStateChange).toHaveBeenCalledWith({
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

      describe('`getFlag`', () => {
        it('should return the flag', () => {
          expect(adapter.getFlag('someFlag1')).toBe(false);
        });
      });
    });

    describe('with flag updates', () => {
      describe('when `subscribeToFlagChanges`', () => {
        beforeEach(() => {
          // Reset due to preivous dispatches
          onFlagsStateChange.mockClear();

          // Checking for change:* callbacks and settings all flags to false.
          client.on.mock.calls.forEach(([event, cb]) => {
            if (event.startsWith('change:')) cb(false);
          });
        });

        it('should `dispatch` `onFlagsStateChange` action', () => {
          expect(onFlagsStateChange).toHaveBeenCalled();
        });

        it('should `dispatch` `onFlagsStateChange` action with camel cased `flags`', () => {
          expect(onFlagsStateChange).toHaveBeenCalledWith({
            someFlag1: false,
          });
          expect(onFlagsStateChange).toHaveBeenCalledWith({
            someFlag2: false,
          });
        });
      });

      describe('when not `subscribeToFlagChanges`', () => {
        beforeEach(async () => {
          // Reset due to preivous dispatches
          onFlagsStateChange.mockClear();
          client.on.mockClear();

          onStatusStateChange = jest.fn();
          onFlagsStateChange = jest.fn();
          client = createClient({
            allFlags: jest.fn(() => flags),
          });

          ldClient.initialize.mockReturnValue(client);

          await adapter.configure({
            subscribeToFlagChanges: false,
            clientSideId,
            user: userWithKey,
            onStatusStateChange,
            onFlagsStateChange,
          });

          onFlagsStateChange.mockClear();
          // Checking for change:* callbacks and settings all flags to false.
          client.on.mock.calls.forEach(([event, cb]) => {
            if (event.startsWith('change:')) cb(false);
          });
        });

        it('should not `dispatch` `onFlagsStateChange` action', () => {
          expect(onFlagsStateChange).not.toHaveBeenCalled();
        });
      });
    });

    describe('`getFlag`', () => {
      it('should return the flag', () => {
        expect(adapter.getFlag('someFlag2')).toBe(false);
      });
    });

    describe('when reconfiguring', () => {
      const nextUser = { key: 'bar-user' };
      let client;

      beforeEach(() => {
        client = createClient({
          identify: jest.fn(() => Promise.resolve()),
        });

        ldClient.initialize.mockReturnValue(client);

        return adapter
          .configure({
            clientSideId,
            user: userWithKey,
            onStatusStateChange,
            onFlagsStateChange,
          })
          .then(() => adapter.reconfigure({ user: nextUser }));
      });

      it('should invoke `identify` on the `client` with the `user`', () => {
        expect(client.identify).toHaveBeenCalledWith(nextUser);
      });
    });

    describe('when updating user context', () => {
      const updatedUserProps = {
        bar: 'baz',
        foo: 'far',
      };

      beforeEach(() => {
        client = createClient({
          identify: jest.fn(() => Promise.resolve()),
        });

        ldClient.initialize.mockReturnValue(client);

        return adapter.configure({
          clientSideId,
          user: userWithKey,
          onStatusStateChange,
          onFlagsStateChange,
        });
      });

      describe('with partial prop update', () => {
        beforeEach(() => {
          return adapter.updateUserContext(updatedUserProps);
        });

        it('should invoke `identify` on the client with the updated props', () => {
          expect(client.identify).toHaveBeenCalledWith(
            expect.objectContaining(updatedUserProps)
          );
        });

        it('should invoke `identify` on the client with the old props', () => {
          expect(client.identify).toHaveBeenCalledWith(
            expect.objectContaining(userWithKey)
          );
        });
      });

      describe('with full prop update', () => {
        beforeEach(() => {
          return adapter.updateUserContext({
            ...userWithKey,
            ...updatedUserProps,
          });
        });

        it('should invoke `identify` on the client with the full props', () => {
          expect(client.identify).toHaveBeenCalledWith({
            ...userWithKey,
            ...updatedUserProps,
          });
        });
      });
    });
  });
});

describe('`camelCasedFlags`', () => {
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

describe('`createAnonymousUser`', () => {
  it('should create user with uuid in key property', () => {
    expect(createAnonymousUserKey()).toBeDefined();
  });

  it('should create uuid of length `foo-random-id`', () => {
    expect(createAnonymousUserKey().length).toBeGreaterThan(0);
  });
});
