import ldClient from 'launchdarkly-js-client-sdk';
import adapter, { camelCaseFlags } from './adapter';

jest.mock('launchdarkly-js-client-sdk', () => ({
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
  waitForInitialization: jest.fn(() => Promise.resolve()),
  on: jest.fn((_, cb) => cb()),
  allFlags: jest.fn(() => ({})),
  variation: jest.fn(() => true),

  ...apiOverwrites,
}));

const triggerFlagValueChange = (client, flagValue = false) =>
  client.on.mock.calls.forEach(([event, cb]) => {
    if (event.startsWith('change:')) cb(flagValue);
  });

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

    it('should reject `updateUserContext`', () =>
      expect(updatingOfUserContext).rejects.toEqual(expect.any(Error)));
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
        expect.objectContaining(userWithKey),
        expect.any(Object)
      );
    });

    it('should initialize the `ld-client` marking the `user` as not anonymous', () => {
      expect(ldClient.initialize).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ anonymous: false }),
        expect.anything()
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

    it('should initialize the `ld-client` with `clientSideId` and no `user` `key`', () => {
      expect(ldClient.initialize).toHaveBeenCalledWith(
        clientSideId,
        expect.objectContaining({
          key: undefined,
          group: 'foo-group',
        }),
        expect.any(Object)
      );
    });

    it('should initialize the `ld-client` marking the `user` as anonymous', () => {
      expect(ldClient.initialize).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ anonymous: true }),
        expect.anything()
      );
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
        variation: jest.fn(() => true),
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

    describe('when `waitForInitialization` throws', () => {
      describe('when it should `throwOnInitializationFailure`', () => {
        beforeEach(() => {
          onStatusStateChange = jest.fn();
          onFlagsStateChange = jest.fn();
          client = createClient({
            waitForInitialization: jest.fn(() => Promise.reject()),
          });

          ldClient.initialize.mockReturnValue(client);
        });

        it('should reject the configuration with an error', async () => {
          await expect(
            adapter.configure({
              clientSideId,
              user: userWithKey,
              onStatusStateChange,
              onFlagsStateChange,
              throwOnInitializationFailure: true,
            })
          ).rejects.toThrow(
            '@flopflip/launchdarkly-adapter: adapter failed to initialize.'
          );
        });
      });
      describe('when it should not `throwOnInitializationFailure`', () => {
        beforeEach(() => {
          onStatusStateChange = jest.fn();
          onFlagsStateChange = jest.fn();
          client = createClient({
            waitForInitialization: jest.fn(() => Promise.reject()),
          });

          ldClient.initialize.mockReturnValue(client);
        });

        it('should resolve the configuration', async () => {
          await expect(
            adapter.configure({
              clientSideId,
              user: userWithKey,
              onStatusStateChange,
              onFlagsStateChange,
              throwOnInitializationFailure: false,
            })
          ).resolves.toEqual(expect.anything());
        });
      });

      describe('when `requestFlags` is passed', () => {
        beforeEach(() => {
          onStatusStateChange = jest.fn();
          onFlagsStateChange = jest.fn();
          client = createClient({
            allFlags: jest.fn(),
            variation: jest.fn(
              (flagName, defaultFlagValue) => defaultFlagValue
            ),
          });

          ldClient.initialize.mockReturnValue(client);

          return adapter.configure({
            clientSideId,
            user: userWithKey,
            onStatusStateChange,
            requestFlags: flags,
            onFlagsStateChange,
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

        it('should load flags not from `allFlags` but `variation`', () => {
          expect(client.allFlags).not.toHaveBeenCalled();
          expect(client.variation).toHaveBeenCalledWith('some-flag-1', true);
          expect(client.variation).toHaveBeenCalledWith('some-flag-2', false);
        });
      });
    });

    describe('with flag updates', () => {
      describe('when `subscribeToFlagChanges`', () => {
        beforeEach(() => {
          // Reset due to preivous dispatches
          onFlagsStateChange.mockClear();

          triggerFlagValueChange(client, true);
        });

        it('should `dispatch` `onFlagsStateChange` action', () => {
          expect(onFlagsStateChange).toHaveBeenCalled();
        });

        it('should `dispatch` `onFlagsStateChange` action with camel cased `flags`', () => {
          expect(onFlagsStateChange).toHaveBeenCalledWith(
            expect.objectContaining({
              someFlag1: true,
            })
          );
          expect(onFlagsStateChange).toHaveBeenCalledWith(
            expect.objectContaining({
              someFlag2: false,
            })
          );
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
            variation: jest.fn(() => true),
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

          triggerFlagValueChange(client);
        });

        it('should not `dispatch` `onFlagsStateChange` action', () => {
          expect(onFlagsStateChange).not.toHaveBeenCalled();
        });
      });

      describe('with `flagsUpdateDelayMs`', () => {
        const flagsUpdateDelayMs = 1000;

        beforeEach(() => {
          jest.useFakeTimers();

          // Reset due to preivous dispatches
          onFlagsStateChange.mockClear();
          client.on.mockClear();

          onStatusStateChange = jest.fn();
          onFlagsStateChange = jest.fn();
          client = createClient({
            allFlags: jest.fn(() => flags),
            variation: jest.fn(() => true),
          });

          ldClient.initialize.mockReturnValue(client);

          return adapter.configure({
            flagsUpdateDelayMs,
            clientSideId,
            user: userWithKey,
            onStatusStateChange,
            onFlagsStateChange,
          });
        });

        it('should `dispatch` `onFlagsStateChange` action once', () => {
          expect(onFlagsStateChange).toHaveBeenCalledTimes(1);
        });

        describe('when flag update occurs', () => {
          beforeEach(() => {
            triggerFlagValueChange(client, true);
          });

          it('should not `dispatch` `onFlagsStateChange` action immidiately', () => {
            expect(onFlagsStateChange).toHaveBeenCalledTimes(1);
          });

          it('should `dispatch` `onFlagsStateChange` action after the delay passed', () => {
            jest.advanceTimersByTime(flagsUpdateDelayMs);

            expect(onFlagsStateChange).toHaveBeenCalledTimes(4);
          });
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
        expect(client.identify).toHaveBeenCalledWith(
          expect.objectContaining(nextUser)
        );
      });
      it('should invoke `identify` on the `client` marking the user as not anonymous', () => {
        expect(client.identify).toHaveBeenCalledWith(
          expect.objectContaining({ anonymous: false })
        );
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
          expect(client.identify).toHaveBeenCalledWith(
            expect.objectContaining({
              ...userWithKey,
              ...updatedUserProps,
            })
          );
        });

        it('should invoke `identify` the `ld-client` marking the `user` as not anonymous', () => {
          expect(client.identify).toHaveBeenCalledWith(
            expect.objectContaining({ anonymous: false })
          );
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
