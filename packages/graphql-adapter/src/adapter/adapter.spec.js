import { AdapterConfigurationStatus } from '@flopflip/types';
import warning from 'tiny-warning';
import getGlobalThis from 'globalthis';
import adapter, { updateFlags, STORAGE_SLICE } from './adapter';

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
      getVariables: () => ({ userId: '123' }),
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
          '{"query":"query AllFeatures { flags: allFeatures { name \\n value} }","variables":{}}',
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
});
