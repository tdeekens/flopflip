import { encodeCacheContext } from '@flopflip/cache';
import { vi, describe, beforeEach, it, expect } from 'vitest';

import { AdapterConfigurationStatus } from '@flopflip/types';
import getGlobalThis from 'globalthis';
import ldClient from 'launchdarkly-js-client-sdk';

import adapter from './adapter';

vi.mock('launchdarkly-js-client-sdk', () => ({
  initialize: vi.fn(),
}));
vi.mock('tiny-warning');

const clientSideId = '123-abc';
const userWithKey = { kind: 'user', key: 'foo-user', anonymous: false };
const userWithoutKey = {
  kind: 'user',
  group: 'foo-group',
};
const flags = { 'some-flag-1': true, 'some-flag-2': false };
const createClient = vi.fn((apiOverwrites) => ({
  waitForInitialization: vi.fn(() => Promise.resolve()),
  on: vi.fn((_, cb) => cb()),
  allFlags: vi.fn(() => ({})),
  variation: vi.fn(() => true),

  ...apiOverwrites,
}));

const triggerFlagValueChange = (client, { flagValue = false } = {}) => {
  for (const [event, cb] of client.on.mock.calls) {
    if (event.startsWith('change:')) {
      cb(flagValue);
    }
  }
};

describe('when configuring', () => {
  let onStatusStateChange;
  let onFlagsStateChange;

  beforeEach(() => {
    onStatusStateChange = vi.fn();
    onFlagsStateChange = vi.fn();

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
    beforeEach(() => {
      adapter.configure(
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
    beforeEach(() => {
      adapter.configure(
        {
          sdk: { clientSideId },
          context: userWithoutKey,
        },
        {
          onStatusStateChange,
          onFlagsStateChange,
        }
      );
    });

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

    describe('without cache', () => {
      beforeEach(async () => {
        onStatusStateChange = vi.fn();
        onFlagsStateChange = vi.fn();
        client = createClient({
          allFlags: vi.fn(() => flags),
          variation: vi.fn(() => true),
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
            'change:some-flag-1',
            expect.any(Function)
          );

          expect(client.on).toHaveBeenCalledWith(
            'change:some-flag-2',
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
            onStatusStateChange = vi.fn();
            onFlagsStateChange = vi.fn();
            client = createClient({
              waitForInitialization: vi.fn(() =>
                Promise.reject(
                  new Error(
                    '@flopflip/launchdarkly-adapter: adapter failed to initialize.'
                  )
                )
              ),
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
            onStatusStateChange = vi.fn();
            onFlagsStateChange = vi.fn();
            client = createClient({
              waitForInitialization: vi.fn(() =>
                Promise.reject(
                  new Error(
                    '@flopflip/launchdarkly-adapter: adapter failed to initialize.'
                  )
                )
              ),
            });

            ldClient.initialize.mockReturnValue(client);

            console.warn = vi.fn();
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
            onStatusStateChange = vi.fn();
            onFlagsStateChange = vi.fn();
            client = createClient({
              allFlags: vi.fn(),
              variation: vi.fn((_, defaultFlagValue) => defaultFlagValue),
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
        describe('with `flagsUpdateDelayMs`', () => {
          const flagsUpdateDelayMs = 1000;

          beforeEach(() => {
            vi.useFakeTimers();

            // Reset due to preivous dispatches
            onFlagsStateChange.mockClear();
            client.on.mockClear();

            onStatusStateChange = vi.fn();
            onFlagsStateChange = vi.fn();
            client = createClient({
              allFlags: vi.fn(() => flags),
              variation: vi.fn(() => true),
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

          // biome-ignore lint/complexity/noExcessiveNestedTestSuites: these test suits could be reorganized
          describe('when flag update occurs', () => {
            describe('without opt-out of subscription', () => {
              beforeEach(() => {
                triggerFlagValueChange(client, { flagValue: true });
              });

              it('should not `dispatch` `onFlagsStateChange` action immidiately', () => {
                expect(onFlagsStateChange).toHaveBeenCalledTimes(1);
              });

              it('should `dispatch` `onFlagsStateChange` action after the delay passed', () => {
                vi.advanceTimersByTime(flagsUpdateDelayMs);

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

      describe('with cache', () => {
        beforeEach(async () => {
          onStatusStateChange.mockClear();
          onFlagsStateChange.mockClear();
          client = createClient({
            allFlags: vi.fn(() => flags),
            variation: vi.fn(() => true),
          });

          ldClient.initialize.mockReturnValue(client);
          sessionStorage.getItem.mockReturnValueOnce(
            JSON.stringify({ cached: true })
          );

          configurationResult = await adapter.configure(
            {
              sdk: { clientSideId },
              context: userWithKey,
              cacheIdentifier: 'session',
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

        it('should restore cached flags', () => {
          expect(sessionStorage.getItem).toHaveBeenCalledWith(
            `@flopflip/launchdarkly-adapter/${encodeCacheContext(userWithKey)}/flags`
          );

          expect(onFlagsStateChange).toHaveBeenCalledWith({
            id: adapter.id,
            flags: {
              cached: true,
            },
          });
        });

        it('should cache newly fetched flags', () => {
          expect(
            JSON.parse(
              sessionStorage.getItem(
                `@flopflip/launchdarkly-adapter/${encodeCacheContext(userWithKey)}/flags`
              )
            )
          ).toStrictEqual({
            someFlag1: false,
            someFlag2: false,
          });
        });

        describe('with lazy cache mode', () => {
          beforeEach(async () => {
            onStatusStateChange.mockClear();
            onFlagsStateChange.mockClear();
            client = createClient({
              allFlags: vi.fn(() => ({
                cached: false,
                updated: false,
              })),
              variation: vi.fn(() => true),
            });

            ldClient.initialize.mockReturnValue(client);
            sessionStorage.getItem.mockReturnValueOnce(
              JSON.stringify({ cached: true })
            );

            configurationResult = await adapter.configure(
              {
                sdk: { clientSideId },
                context: userWithKey,
                cacheIdentifier: 'session',
                cacheMode: 'lazy',
              },
              {
                onStatusStateChange,
                onFlagsStateChange,
              }
            );
          });

          it('should only flush cached but not updated flags', () => {
            expect(onFlagsStateChange).toHaveBeenCalledWith({
              id: adapter.id,
              flags: expect.objectContaining({
                cached: true,
              }),
            });

            expect(onFlagsStateChange).toHaveBeenCalledWith({
              id: adapter.id,
              flags: expect.not.objectContaining({
                updated: true,
              }),
            });
          });

          // biome-ignore lint/complexity/noExcessiveNestedTestSuites: these test suits could be reorganized
          describe('when flag update occurs', () => {
            it('should resolve to a successful initialization status', () => {
              expect(configurationResult).toEqual(
                expect.objectContaining({
                  initializationStatus: 0,
                })
              );
            });

            it('should update non cached flags and not cached flags', () => {
              expect(client.allFlags).toHaveBeenCalled();
              triggerFlagValueChange(client, { flagValue: true });
              expect(onFlagsStateChange).toHaveBeenCalledWith({
                id: adapter.id,
                flags: {
                  // Value was cached, thus should not be updated
                  cached: true,
                },
              });
            });
          });
        });
      });
    });

    describe('`getFlag`', () => {
      it('should return the flag', () => {
        expect(adapter.getFlag('updated')).toBe(true);
      });
    });

    describe('when reconfiguring', () => {
      const nextContext = { kind: 'user', key: 'bar-user' };
      let client;

      beforeEach(async () => {
        client = createClient({
          identify: vi.fn(() => Promise.resolve()),
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
          identify: vi.fn(() => Promise.resolve()),
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
        beforeEach(() => {
          adapter.updateClientContext(updatedClientProps);
        });

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
        beforeEach(() => {
          adapter.updateClientContext({
            ...userWithKey,
            ...updatedClientProps,
          });
        });

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
    const global = getGlobalThis();

    expect(global).toHaveProperty('__flopflip__.launchdarkly', adapter);
  });
});
