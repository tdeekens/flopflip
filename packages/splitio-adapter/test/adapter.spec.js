import { AdapterConfigurationStatus } from '@flopflip/types';
import { SplitFactory } from '@splitsoftware/splitio';
import getGlobalThis from 'globalthis';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { adapter, createAnonymousUserKey, normalizeFlag } from '../src/adapter';

vi.mock('@splitsoftware/splitio', () => ({
  SplitFactory: vi.fn(() => ({
    client: vi.fn(() => ({
      on: vi.fn((_, cb) => cb()),
      getTreatments: vi.fn(() => ({})),
      Event: {
        SDK_READY: 'SDK_READY',
        SDK_UPDATE: 'SDK_UPDATE',
      },
    })),
    manager: vi.fn(() => ({
      names: vi.fn(() => []),
    })),
  })),
}));

const authorizationKey = '123-abc';
const userWithKey = { key: 'foo-user' };
const userWithoutKey = {
  group: 'foo-group',
};
const names = ['some-flag-1', 'some-flag-2'];
const flags = { 'some-flag-1': true, 'some-flag-2': false };

describe('when configuring', () => {
  let onStatusStateChange;
  let onFlagsStateChange;

  beforeEach(() => {
    onStatusStateChange = vi.fn();
    onFlagsStateChange = vi.fn();
  });

  it('should indicate that the adapter is not configured', () => {
    expect(
      adapter.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
    ).toBe(false);
  });

  describe('when reconfiguring before configured', () => {
    it('should reject reconfiguration', () =>
      expect(adapter.reconfigure({ user: userWithKey })).rejects.toEqual(
        expect.any(Error)
      ));
  });

  describe('with user key', () => {
    beforeEach(() => {
      adapter.configure(
        {
          sdk: { authorizationKey },
          user: userWithKey,
        },
        {
          onStatusStateChange,
          onFlagsStateChange,
        }
      );
    });

    it('should initialize the `SplitFactory` client with `authorizationKey` and given `user`', () => {
      expect(SplitFactory).toHaveBeenCalledWith({
        core: {
          authorizationKey,
          key: userWithKey.key,
        },
      });
    });
  });

  describe('without key', () => {
    beforeEach(() => {
      adapter.configure(
        {
          sdk: { authorizationKey },
          user: userWithoutKey,
        },
        {
          onStatusStateChange,
          onFlagsStateChange,
        }
      );
    });

    it('should initialize the `SplitFactory` with `authorizationKey` and random `user` `key`', () => {
      expect(SplitFactory).toHaveBeenCalledWith({
        core: {
          authorizationKey,
          key: expect.any(String),
        },
      });
    });
  });

  describe('with options', () => {
    const options = {
      additional: 'option',
    };

    beforeEach(() => {
      adapter.configure(
        {
          sdk: { authorizationKey, options },
          user: userWithKey,
        },
        {
          onStatusStateChange,
          onFlagsStateChange,
        }
      );
    });

    it('should initialize the `SplitFactory` client with `options`', () => {
      expect(SplitFactory).toHaveBeenCalledWith({
        ...options,
        core: {
          authorizationKey,
          key: userWithKey.key,
        },
      });
    });
  });

  describe('with `core` options', () => {
    const coreOptions = {
      additional: 'core-option',
    };

    beforeEach(() => {
      adapter.configure(
        {
          sdk: { authorizationKey, options: { core: coreOptions } },
          user: userWithKey,
        },
        {
          onStatusStateChange,
          onFlagsStateChange,
        }
      );
    });

    it('should initialize the `SplitFactory` client with `core` options in `core` property', () => {
      expect(SplitFactory).toHaveBeenCalledWith({
        core: {
          ...coreOptions,
          authorizationKey,
          key: userWithKey.key,
        },
      });
    });
  });

  describe('when configured', () => {
    const treatmentStub = vi.fn(() => flags);
    let factory;
    let onStub;
    let onStatusStateChange;
    let onFlagsStateChange;
    let configurationResult;

    beforeEach(async () => {
      onStatusStateChange = vi.fn();
      onFlagsStateChange = vi.fn();
      onStub = vi.fn((_, cb) => cb());

      factory = {
        client: vi.fn(() => ({
          on: onStub,
          getTreatments: treatmentStub,
          Event: {
            SDK_READY: 'SDK_READY',
            SDK_UPDATE: 'SDK_UPDATE',
          },
        })),
        manager: vi.fn(() => ({
          names: vi.fn(() => names),
        })),
      };

      SplitFactory.mockReturnValue(factory);

      configurationResult = await adapter.configure(
        {
          sdk: {
            authorizationKey,
            treatmentAttributes: {
              platform: 'iOS',
            },
          },
          user: userWithKey,
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

    it('should `dispatch` `onUpdateStatus` action with configured', () => {
      expect(onStatusStateChange).toHaveBeenCalledWith({
        id: adapter.id,
        status: { configurationStatus: AdapterConfigurationStatus.Configuring },
      });
    });

    describe('when `splitio` is configured', () => {
      it('should call getTreatments with attributes', () => {
        expect(treatmentStub).toHaveBeenCalledWith(userWithKey.key, names, {
          ...userWithKey,
          platform: 'iOS',
        });
      });

      it('should indicate that the adapter is not configured', () => {
        expect(
          adapter.getIsConfigurationStatus(
            AdapterConfigurationStatus.Configured
          )
        ).toBe(true);
      });

      it('should `dispatch` `onUpdateStatus` action with configured', () => {
        expect(onStatusStateChange).toHaveBeenCalledWith({
          id: adapter.id,
          status: {
            configurationStatus: AdapterConfigurationStatus.Configured,
          },
        });
      });

      it('should `dispatch` `onStatusStateChange`', () => {
        expect(onFlagsStateChange).toHaveBeenCalledWith({
          id: adapter.id,
          flags: {
            someFlag1: true,
            someFlag2: false,
          },
        });
      });

      it('should register callbacks to receive flag updates', () => {
        expect(onStub).toHaveBeenCalledWith(
          factory.client().Event.SDK_UPDATE,
          expect.any(Function)
        );
      });
    });

    describe('when reconfiguring', () => {
      const nextUser = { key: 'bar-user' };
      let namesStub;
      let getTreatmentsStub;
      let factory;

      beforeEach(async () => {
        onStatusStateChange = vi.fn();
        onFlagsStateChange = vi.fn();
        namesStub = vi.fn(() => names);
        getTreatmentsStub = vi.fn(() => flags);

        factory = {
          client: vi.fn(() => ({
            on: vi.fn((_, cb) => cb()),
            getTreatments: getTreatmentsStub,
            Event: {
              SDK_READY: 'SDK_READY',
              SDK_UPDATE: 'SDK_UPDATE',
            },
            destroy: vi.fn(),
          })),
          manager: vi.fn(() => ({
            names: namesStub,
          })),
        };

        SplitFactory.mockReturnValue(factory);

        configurationResult = await adapter
          .configure(
            {
              sdk: {
                authorizationKey,
                treatmentAttributes: {
                  platform: 'iOS',
                },
              },
              user: userWithKey,
            },
            {
              onStatusStateChange,
              onFlagsStateChange,
            }
          )
          .then(() => {
            // NOTE: Clearing stubs as they are invoked
            // first during `configure`.
            namesStub.mockClear();
            getTreatmentsStub.mockClear();

            return adapter.reconfigure(
              {
                user: nextUser,
                sdk: {
                  treatmentAttributes: {
                    platform: 'android',
                  },
                },
              },
              { onStatusStateChange, onFlagsStateChange }
            );
          });
      });

      it('should resolve to a successful initialization status', () => {
        expect(configurationResult).toEqual(
          expect.objectContaining({
            initializationStatus: 0,
          })
        );
      });

      it('should call getTreatments with attributes', () => {
        expect(getTreatmentsStub).toHaveBeenCalledWith(nextUser.key, names, {
          ...nextUser,
          platform: 'android',
        });
      });
    });
  });
});

describe('create anonymous user', () => {
  it('should create user with uuid in key property', () => {
    expect(createAnonymousUserKey()).toBeDefined();
  });

  it('should create uuid of length `foo-random-id`', () => {
    expect(createAnonymousUserKey().length).toBeGreaterThan(0);
  });
});

describe('normalizeFlag', () => {
  const flagName = 'fooFlag';

  describe('with `flagValue` being `null`', () => {
    it('should return `false`', () => {
      expect(normalizeFlag(flagName, null)).toEqual([flagName, false]);
    });
  });

  describe('with `flagValue` being `on`', () => {
    it('should return `true`', () => {
      expect(normalizeFlag(flagName, 'on')).toEqual([flagName, true]);
    });
  });

  describe('with `flagValue` being `off`', () => {
    it('should return `false`', () => {
      expect(normalizeFlag(flagName, 'off')).toEqual([flagName, false]);
    });
  });

  describe('with anoy other `flagValue`', () => {
    describe('with a `String`', () => {
      it('should the `String`', () => {
        expect(normalizeFlag(flagName, 'Yeehaaw')).toEqual([
          flagName,
          'Yeehaaw',
        ]);
      });
    });

    describe('with a `Number`', () => {
      it('should the `Number`', () => {
        expect(normalizeFlag(flagName, 42)).toEqual([flagName, 42]);
      });
    });
  });
});

describe('exposeGlobally', () => {
  it('should expose `adapter` globally', () => {
    const global = getGlobalThis();

    expect(global).toHaveProperty('__flopflip__.splitio', adapter);
  });
});
