import { AdapterConfigurationStatus } from '@flopflip/types';
import warning from 'tiny-warning';
import getGlobalThis from 'globalthis';
import adapter, { getUser, updateFlags } from './adapter';

jest.mock('tiny-warning');

const createAdapterEventHandlers = (custom = {}) => ({
  onFlagsStateChange: jest.fn(),
  onStatusStateChange: jest.fn(),
  ...custom,
});

describe('when configuring', () => {
  let adapterArgs = {};
  let adapterEventHandlers;

  beforeEach(() => {
    adapterEventHandlers = createAdapterEventHandlers();
  });

  describe('when not configured', () => {
    it('should indicate that the adapter is not configured', () => {
      expect(
        adapter.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
      ).toBe(false);
    });

    describe('updating flags', () => {
      beforeEach(() => {
        updateFlags({ attempted: 'flagUpdate' });
      });

      it('should invoke and trigger `warning`', () => {
        expect(warning).toHaveBeenCalledWith(false, expect.any(String));
      });
    });
  });
});

describe('when configured', () => {
  let adapterArgs = {
    adapterConfiguration: {
      url: `https://localhost:8080/graphql`,
      query: 'query AllFeatures { flags: allFeatures { name \n value} }',
      getQueryVariables: jest.fn(() => ({ userId: '123' })),
      getRequestHeaders: jest.fn(() => ({})),
      parseFlags: jest.fn(() => ({})),
      fetcher: jest.fn(() =>
        Promise.resolve({
          json: () => Promise.resolve({ enabled: true, disabled: false }),
        })
      ),
    },
  };
  let configurationResult;
  let adapterEventHandlers;

  beforeEach(async () => {
    adapterEventHandlers = createAdapterEventHandlers();
    jest.useFakeTimers();
    configurationResult = await adapter.configure(
      adapterArgs,
      adapterEventHandlers
    );
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should resolve to a successful initialization status', () => {
    expect(configurationResult).toEqual(
      expect.objectContaining({
        initializationStatus: 0,
      })
    );
  });

  it('should invoke the fetcher with uri', () => {
    expect(adapterArgs.adapterConfiguration.fetcher).toHaveBeenCalledWith(
      adapterArgs.adapterConfiguration.uri,
      expect.anything()
    );
  });

  it('should invoke the fetcher with body', () => {
    expect(adapterArgs.adapterConfiguration.fetcher).toHaveBeenCalledWith(
      adapterArgs.adapterConfiguration.uri,
      {
        body:
          '{"query":"query AllFeatures { flags: allFeatures { name \\n value} }","variables":{"userId":"123"}}',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      }
    );
  });

  it('should invoke `onStatusStateChange` with configuring', () => {
    expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        configurationStatus: AdapterConfigurationStatus.Configuring,
      })
    );
  });

  it('should indicate that the adapter is configured', () => {
    expect(
      adapter.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
    ).toBe(true);
  });

  it('should invoke `onStatusStateChange` with configured', () => {
    expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
      expect.objectContaining({
        configurationStatus: AdapterConfigurationStatus.Configured,
      })
    );
  });

  it('should resolve `waitUntilConfigured`', async () => {
    await expect(adapter.waitUntilConfigured()).resolves.not.toBeDefined();
  });

  it('should invoke `onStatusStateChange`', () => {
    expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalled();
  });

  it('should invoke `onFlagsStateChange`', () => {
    expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
  });

  it('should apply query variables and pass adapter args for evaluation', () => {
    expect(
      adapterArgs.adapterConfiguration.getQueryVariables
    ).toHaveBeenCalledWith(adapterArgs);
  });

  it('should apply request headers and pass adapter args for evaluation', () => {
    expect(
      adapterArgs.adapterConfiguration.getRequestHeaders
    ).toHaveBeenCalledWith(adapterArgs);
  });

  it('should allow parsing flags', () => {
    expect(adapterArgs.adapterConfiguration.parseFlags).toHaveBeenCalled();
  });

  describe('when updating flags', () => {
    const updatedFlags = { fooFlag: true, barFlag: false };

    beforeEach(() => {
      // From `configure`
      adapterEventHandlers.onFlagsStateChange.mockClear();

      updateFlags(updatedFlags);
    });

    it('should invoke but not trigger `warning`', () => {
      expect(warning).toHaveBeenCalledWith(true, expect.any(String));
    });

    it('should invoke `onFlagsStateChange`', () => {
      expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
    });

    it('should invoke `onFlagsStateChange` with `updatedFlags`', () => {
      expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith(
        expect.objectContaining(updatedFlags)
      );
    });

    describe('when flags are not normalized', () => {
      const nonNormalizedUpdatedFlags = {
        'flag-a-1': false,
        flag_b: null,
      };
      beforeEach(() => {
        // From `configure`
        adapterEventHandlers.onFlagsStateChange.mockClear();

        updateFlags(nonNormalizedUpdatedFlags);
      });

      it('should invoke `onFlagsStateChange`', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
      });

      it('should normalise all flag names and values', () => {
        expect(adapter.getFlag('flagA1')).toEqual(false);
        expect(adapter.getFlag('flagB')).toEqual(false);
      });
    });

    describe('when flag is locked', () => {
      beforeEach(() => {
        adapterEventHandlers.onFlagsStateChange.mockClear();

        updateFlags(updatedFlags, { lockFlags: true });

        updateFlags({ fooFlag: false });
      });

      it('should not update the locked flag', () => {
        expect(adapter.getFlag('fooFlag')).toEqual(true);
      });
    });
  });

  describe('when reconfiguring', () => {
    const user = { id: 'bar' };

    beforeEach(async () => {
      configurationResult = await adapter.reconfigure({ user });
    });

    it('should resolve to a successful initialization status', () => {
      expect(configurationResult).toEqual(
        expect.objectContaining({
          initializationStatus: 0,
        })
      );
    });

    it('should update the user', () => {
      expect(getUser()).toEqual(user);
    });

    it('should invoke `onFlagsStateChange`', () => {
      expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
    });

    it('should invoke `onFlagsStateChange` with empty flags', () => {
      expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({});
    });
  });

  describe('when resetting', () => {
    const updatedFlags = { fooFlag: true, barFlag: false };

    beforeEach(() => {
      updateFlags(updatedFlags);

      adapterEventHandlers.onFlagsStateChange.mockClear();

      adapter.reset();
    });

    it('should invoke not `onFlagsStateChange`', () => {
      expect(adapterEventHandlers.onFlagsStateChange).not.toHaveBeenCalled();
    });

    it('should reset the flags', () => {
      expect(adapter.getFlag(updatedFlags.fooFlag)).not.toBeDefined();
      expect(adapter.getFlag(updatedFlags.barFlag)).not.toBeDefined();
    });
  });

  describe('when setting configuration status to configuring', () => {
    beforeEach(() => {
      adapterEventHandlers.onStatusStateChange.mockClear();

      adapter.setConfigurationStatus(AdapterConfigurationStatus.Configuring);
    });

    it('should invoke `onStatusStateChange` with configuring', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          configurationStatus: AdapterConfigurationStatus.Configuring,
        })
      );
    });

    it('should indicate that the adapter is not configured', () => {
      expect(
        adapter.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
      ).toBe(false);
    });

    it('should invoke `onStatusStateChange` with configured', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith(
        expect.objectContaining({
          configurationStatus: AdapterConfigurationStatus.Configuring,
        })
      );
    });
  });
});

describe('exposeGlobally', () => {
  it('should expose `adapter` globally', () => {
    const globalThis = getGlobalThis();

    expect(globalThis).toHaveProperty('__flopflip__.graphql.adapter', adapter);
  });

  it('should expose `updateFlags` globally', () => {
    const globalThis = getGlobalThis();

    expect(globalThis).toHaveProperty(
      '__flopflip__.graphql.updateFlags',
      updateFlags
    );
  });
});
