import { AdapterConfigurationStatus } from '@flopflip/types';
import getGlobalThis from 'globalthis';
import ldClient from 'launchdarkly-js-client-sdk';

import adapter from './adapter';

jest.mock('launchdarkly-js-client-sdk', () => ({
  initialize: jest.fn(),
}));
jest.mock('tiny-warning');

const clientSideId = '123-abc';
const userWithKey = { kind: 'user', key: 'foo-user' };
const userWithoutKey = {
  kind: 'user',
  group: 'foo-group',
};
const flags = { 'some-flag-1': true, 'some-flag-2': false };
const createClient = jest.fn((apiOverwrites) => ({
  waitForInitialization: jest.fn(() => Promise.resolve()),
  on: jest.fn((_, cb) => cb()),
  allFlags: jest.fn(() => ({})),
  variation: jest.fn(() => true),

  ...apiOverwrites,
}));

const triggerFlagValueChange = (client, { flagValue = false } = {}) =>
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

  it('should indicate that the adapter is not configured', () => {
    expect(
      adapter.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
    ).toBe(false);
  });

  it('should not return client', () => {
    expect(adapter.getClient()).toBe(undefined);
  });

  describe('when reconfiguring before configured', () => {
    it('should reject reconfiguration', () =>
      expect(adapter.reconfigure({ context: userWithKey })).rejects.toEqual(
        expect.any(Error)
      ));
  });

  describe('when changing user context before configured', () => {
    const updatedClientProps = {
      kind: 'user',
      bar: 'baz',
      foo: 'far',
    };
    let updatingOfClientContext;

    beforeEach(() => {
      updatingOfClientContext = adapter.updateClientContext(updatedClientProps);

      return updatingOfClientContext.catch(() => null);
    });

    it('should reject `updateClientContext`', () =>
      expect(updatingOfClientContext).rejects.toEqual(expect.any(Error)));
  });

  describe('with user key', () => {
    beforeEach(() =>
      adapter.configure(
        {
          sdk: { clientSideId },
          context: userWithKey,
        },
        {
          onStatusStateChange,
          onFlagsStateChange,
        }
      )
    );

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
      adapter.configure(
        {
          sdk: { clientSideId },
          context: userWithoutKey,
        },
        {
          onStatusStateChange,
          onFlagsStateChange,
        }
      )
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

  describe('when configured', () => {
    let client;
    let onStatusStateChange;
    let onFlagsStateChange;
    let configurationResult;

    beforeEach(async () => {
      onStatusStateChange = jest.fn();
      onFlagsStateChange = jest.fn();
      client = createClient({
        allFlags: jest.fn(() => flags),
        variation: jest.fn(() => true),
      });

      ldClient.initialize.mockReturnValue(client);

      configurationResult = await adapter.configure(
        {
          sdk: { clientSideId },
          context: userWithKey,
        },
        {
          onStatusStateChange,
          onFlagsStateChange,
        }
      );
    });

    it('should resolve to a successful initialization status', () => {
      expect(configurationResult).toEqual(
        expect.objectContaining({
          initializationStatus: 0,
        })
      );
    });

    describe('when `ldClient` is configured', () => {
      describe('when determining if adapter is configured', () => {
        it('should indicate that the adapter is configured', () => {
          expect(
            adapter.getIsConfigurationStatus(
              AdapterConfigurationStatus.Configured
            )
          ).toBe(true);
        });

        it('should return client', () => {
          expect(adapter.getClient()).toEqual(
            expect.objectContaining({
              allFlags: expect.any(Function),
              on: expect.any(Function),
              variation: expect.any(Function),
              waitForInitialization: expect.any(Function),
            })
          );
        });
      });

      it('should `dispatch` `onUpdateStatus` action with configured', () => {
        expect(onStatusStateChange).toHaveBeenCalledWith({
          id: adapter.id,
          status: {
            configurationStatus: AdapterConfigurationStatus.Configured,
          },
        });
      });

      it('should `dispatch` `onFlagsStateChange`', () => {
        expect(onFlagsStateChange).toHaveBeenCalledWith({
          id: adapter.id,
          flags: {
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
            waitForInitialization: jest.fn(() => {
              throw new Error();
            }),
          });

          ldClient.initialize.mockReturnValue(client);
        });

        it('should reject the configuration with an error', async () => {
          await expect(
            adapter.configure(
              {
                sdk: { clientSideId },
                context: userWithKey,
                throwOnInitializationFailure: true,
              },
              {
                onStatusStateChange,
                onFlagsStateChange,
              }
            )
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
            waitForInitialization: jest.fn(() => {
              throw new Error();
            }),
          });

          ldClient.initialize.mockReturnValue(client);

          console.warn = jest.fn();
        });

        it('should resolve the configuration', async () => {
          await expect(
            adapter.configure(
              {
                sdk: { clientSideId },
                context: userWithKey,
                throwOnInitializationFailure: false,
              },
              {
                onStatusStateChange,
                onFlagsStateChange,
              }
            )
          ).resolves.toEqual(expect.anything());

          expect(console.warn).toHaveBeenCalled();
        });
      });

      describe('when `flags` is passed', () => {
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

          return adapter.configure(
            {
              sdk: { clientSideId },
              context: userWithKey,
              flags,
            },
            {
              onStatusStateChange,
              onFlagsStateChange,
            }
          );
        });

        it('should `dispatch` `onUpdateStatus` action with configured', () => {
          expect(onStatusStateChange).toHaveBeenCalledWith({
            id: adapter.id,
            status: {
              configurationStatus: AdapterConfigurationStatus.Configured,
            },
          });
        });

        it('should `dispatch` `onFlagsStateChange`', () => {
          expect(onFlagsStateChange).toHaveBeenCalledWith({
            id: adapter.id,
            flags: {
              someFlag1: true,
              someFlag2: false,
            },
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

          await adapter.configure(
            {
              sdk: { clientSideId },
              subscribeToFlagChanges: false,
              context: userWithKey,
            },
            {
              onStatusStateChange,
              onFlagsStateChange,
            }
          );

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

          return adapter.configure(
            {
              sdk: { clientSideId },
              flagsUpdateDelayMs,
              context: userWithKey,
            },
            {
              onStatusStateChange,
              onFlagsStateChange,
            }
          );
        });

        it('should `dispatch` `onFlagsStateChange` action once', () => {
          expect(onFlagsStateChange).toHaveBeenCalledTimes(1);
        });

        describe('when flag update occurs', () => {
          describe('without opt-out of subscription', () => {
            beforeEach(() => {
              triggerFlagValueChange(client, { flagValue: true });
            });

            it('should not `dispatch` `onFlagsStateChange` action immidiately', () => {
              expect(onFlagsStateChange).toHaveBeenCalledTimes(1);
            });

            it('should `dispatch` `onFlagsStateChange` action after the delay passed', () => {
              jest.advanceTimersByTime(flagsUpdateDelayMs);

              expect(onFlagsStateChange).toHaveBeenCalledTimes(4);
            });
          });

          describe('with opt-out of flag change subscription', () => {
            beforeEach(() => {
              onFlagsStateChange.mockClear();
              adapter.updateFlags(
                { someFlag1: true },
                { unsubscribeFlags: true }
              );
              triggerFlagValueChange(client, { flagValue: true });
            });

            it('should not `dispatch` `onFlagsStateChange` action', () => {
              expect(onFlagsStateChange).toHaveBeenCalledTimes(1);
            });
          });
        });
      });

      describe('when flag is locked', () => {
        it('should not allow seting the flag value again', () => {
          adapter.updateFlags({ someFlag1: true }, { lockFlags: true });

          expect(adapter.getFlag('someFlag1')).toBe(true);

          adapter.updateFlags({ someFlag1: false });

          expect(adapter.getFlag('someFlag1')).toBe(true);
        });
      });
    });

    describe('`getFlag`', () => {
      it('should return the flag', () => {
        expect(adapter.getFlag('someFlag2')).toBe(false);
      });
    });

    describe('when reconfiguring', () => {
      const nextContext = { kind: 'user', key: 'bar-user' };
      let client;

      beforeEach(async () => {
        client = createClient({
          identify: jest.fn(() => Promise.resolve()),
        });

        ldClient.initialize.mockReturnValue(client);

        await adapter.configure(
          {
            sdk: { clientSideId },
            context: userWithKey,
          },
          {
            onStatusStateChange,
            onFlagsStateChange,
          }
        );

        configurationResult = await adapter.reconfigure({
          context: nextContext,
        });
      });

      it('should resolve to a successful initialization status', () => {
        expect(configurationResult).toEqual(
          expect.objectContaining({
            initializationStatus: 0,
          })
        );
      });

      it('should invoke `identify` on the `client` with the `context`', () => {
        expect(client.identify).toHaveBeenCalledWith(
          expect.objectContaining(nextContext)
        );
      });
      it('should invoke `identify` on the `client` marking the user as not anonymous', () => {
        expect(client.identify).toHaveBeenCalledWith(
          expect.objectContaining({ anonymous: false })
        );
      });
    });

    describe('when updating client context', () => {
      const updatedClientProps = {
        bar: 'baz',
        foo: 'far',
      };

      beforeEach(() => {
        client = createClient({
          identify: jest.fn(() => Promise.resolve()),
        });

        ldClient.initialize.mockReturnValue(client);

        return adapter.configure(
          {
            sdk: { clientSideId },
            context: userWithKey,
          },
          {
            onStatusStateChange,
            onFlagsStateChange,
          }
        );
      });

      describe('with partial prop update', () => {
        beforeEach(() => adapter.updateClientContext(updatedClientProps));

        it('should invoke `identify` on the client with the updated props', () => {
          expect(client.identify).toHaveBeenCalledWith(
            expect.objectContaining(updatedClientProps)
          );
        });

        it('should invoke `identify` on the client with the old props', () => {
          expect(client.identify).toHaveBeenCalledWith(
            expect.objectContaining(userWithKey)
          );
        });
      });

      describe('with full prop update', () => {
        beforeEach(() =>
          adapter.updateClientContext({
            ...userWithKey,
            ...updatedClientProps,
          })
        );

        it('should invoke `identify` on the client with the full props', () => {
          expect(client.identify).toHaveBeenCalledWith(
            expect.objectContaining({
              ...userWithKey,
              ...updatedClientProps,
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

describe('exposeGlobally', () => {
  it('should expose `adapter` globally', () => {
    const globalThis = getGlobalThis();

    expect(globalThis).toHaveProperty('__flopflip__.launchdarkly', adapter);
  });
});
