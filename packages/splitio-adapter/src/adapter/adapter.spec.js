import { AdapterConfigurationStatus } from '@flopflip/types';
import { SplitFactory } from '@splitsoftware/splitio';
import getGlobalThis from 'globalthis';
import adapter, {
  normalizeFlags,
  createAnonymousUserKey,
  normalizeFlag,
} from './adapter';

jest.mock('@splitsoftware/splitio', () => ({
  SplitFactory: jest.fn(() => ({
    client: jest.fn(() => ({
      on: jest.fn((_, cb) => cb()),
      getTreatments: jest.fn(() => ({})),
      Event: {
        SDK_READY: 'SDK_READY',
        SDK_UPDATE: 'SDK_UPDATE',
      },
    })),
    manager: jest.fn(() => ({
      names: jest.fn(() => []),
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
    onStatusStateChange = jest.fn();
    onFlagsStateChange = jest.fn();
  });

  it('should indicate that the adapter is not configured', () => {
    expect(
      adapter.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
    ).toBe(false);
  });

  describe('when reconfiguring before configured', () => {
    it('should reject reconfiguration', () => {
      return expect(adapter.reconfigure({ user: userWithKey })).rejects.toEqual(
        expect.any(Error)
      );
    });
  });

  describe('with user key', () => {
    beforeEach(() => {
      return adapter.configure(
        {
          authorizationKey,
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
    beforeEach(() =>
      adapter.configure(
        {
          authorizationKey,
          user: userWithoutKey,
        },
        {
          onStatusStateChange,
          onFlagsStateChange,
        }
      )
    );

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
      return adapter.configure(
        {
          authorizationKey,
          user: userWithKey,
          options,
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
      return adapter.configure(
        {
          authorizationKey,
          user: userWithKey,
          options: {
            core: coreOptions,
          },
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
    let factory;
    let onStub;
    let onStatusStateChange;
    let onFlagsStateChange;
    let treatmentStub = jest.fn(() => flags);
    let configurationResult;

    beforeEach(async () => {
      onStatusStateChange = jest.fn();
      onFlagsStateChange = jest.fn();
      onStub = jest.fn((_, cb) => cb());

      factory = {
        client: jest.fn(() => ({
          on: onStub,
          getTreatments: treatmentStub,
          Event: {
            SDK_READY: 'SDK_READY',
            SDK_UPDATE: 'SDK_UPDATE',
          },
        })),
        manager: jest.fn(() => ({
          names: jest.fn(() => names),
        })),
      };

      SplitFactory.mockReturnValue(factory);

      configurationResult = await adapter.configure(
        {
          authorizationKey,
          user: userWithKey,
          treatmentAttributes: {
            platform: 'iOS',
          },
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
        configurationStatus: AdapterConfigurationStatus.Configuring,
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
          configurationStatus: AdapterConfigurationStatus.Configured,
        });
      });

      it('should `dispatch` `onStatusStateChange`', () => {
        expect(onFlagsStateChange).toHaveBeenCalledWith({
          someFlag1: true,
          someFlag2: false,
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
        onStatusStateChange = jest.fn();
        onFlagsStateChange = jest.fn();
        namesStub = jest.fn(() => names);
        getTreatmentsStub = jest.fn(() => flags);

        factory = {
          client: jest.fn(() => ({
            on: jest.fn((_, cb) => cb()),
            getTreatments: getTreatmentsStub,
            Event: {
              SDK_READY: 'SDK_READY',
              SDK_UPDATE: 'SDK_UPDATE',
            },
            destroy: jest.fn(),
          })),
          manager: jest.fn(() => ({
            names: namesStub,
          })),
        };

        SplitFactory.mockReturnValue(factory);

        configurationResult = await adapter
          .configure(
            {
              authorizationKey,
              user: userWithKey,
              treatmentAttributes: {
                platform: 'iOS',
              },
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

            return adapter.reconfigure({
              user: nextUser,
              onStatusStateChange,
              onFlagsStateChange,
              treatmentAttributes: {
                platform: 'android',
              },
            });
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
    const globalThis = getGlobalThis();

    expect(globalThis).toHaveProperty('__flopflip__.splitio.adapter', adapter);
  });
});
