import { encodeCacheContext } from '@flopflip/cache';
import { AdapterConfigurationStatus } from '@flopflip/types';
import getGlobalThis from 'globalthis';
import warning from 'tiny-warning';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { adapter } from '../src/adapter';

vi.mock('tiny-warning');

const createAdapterEventHandlers = (custom = {}) => ({
  onFlagsStateChange: vi.fn(),
  onStatusStateChange: vi.fn(),
  ...custom,
});

describe('when configuring', () => {
  describe('when not configured', () => {
    it('should indicate that the adapter is not configured', () => {
      expect(
        adapter.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
      ).toBe(false);
    });

    describe('updating flags', () => {
      beforeEach(() => {
        adapter.updateFlags({ attempted: 'flagUpdate' });
      });

      it('should invoke and trigger `warning`', () => {
        expect(warning).toHaveBeenCalledWith(false, expect.any(String));
      });
    });
  });
});

describe('when configured', () => {
  const adapterArgs = {
    url: 'https://localhost:8080/graphql',
    user: { key: 'initial-user' },
    query: 'query AllFeatures { flags: allFeatures { name \n value} }',
    getQueryVariables: vi.fn(() => ({ userId: '123' })),
    getRequestHeaders: vi.fn(() => ({})),
    parseFlags: vi.fn((flags) => flags),
    fetcher: vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ data: { enabled: true, disabled: false } }),
    }),
  };
  let configurationResult;
  let adapterEventHandlers;

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe('without cache', () => {
    beforeEach(async () => {
      adapterEventHandlers = createAdapterEventHandlers();
      vi.useFakeTimers();
      configurationResult = await adapter.configure(
        adapterArgs,
        adapterEventHandlers
      );
    });

    it('should resolve to a successful initialization status', () => {
      expect(configurationResult).toEqual(
        expect.objectContaining({
          initializationStatus: 0,
        })
      );
    });

    it('should invoke the fetcher with uri', () => {
      expect(adapterArgs.fetcher).toHaveBeenCalledWith(
        adapterArgs.uri,
        expect.anything()
      );
    });

    it('should invoke the fetcher with body', () => {
      expect(adapterArgs.fetcher).toHaveBeenCalledWith(adapterArgs.uri, {
        body: '{"query":"query AllFeatures { flags: allFeatures { name \\n value} }","variables":{"userId":"123"}}',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      });
    });

    it('should invoke `onStatusStateChange` with configuring', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith({
        id: adapter.id,
        status: expect.objectContaining({
          configurationStatus: AdapterConfigurationStatus.Configuring,
        }),
      });
    });

    it('should indicate that the adapter is configured', () => {
      expect(
        adapter.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
      ).toBe(true);
    });

    it('should invoke `onStatusStateChange` with configured', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith({
        id: adapter.id,
        status: expect.objectContaining({
          configurationStatus: AdapterConfigurationStatus.Configured,
        }),
      });
    });

    it('should resolve `waitUntilConfigured`', async () => {
      await expect(adapter.waitUntilConfigured()).resolves.not.toBeDefined();
    });

    it('should invoke `onStatusStateChange`', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalled();
    });

    it('should invoke `onFlagsStateChange`', () => {
      expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
        id: adapter.id,
        flags: {
          enabled: true,
          disabled: false,
        },
      });
    });

    it('should apply query variables and pass adapter args for evaluation', () => {
      expect(adapterArgs.getQueryVariables).toHaveBeenCalledWith(adapterArgs);
    });

    it('should apply request headers and pass adapter args for evaluation', () => {
      expect(adapterArgs.getRequestHeaders).toHaveBeenCalledWith(adapterArgs);
    });

    it('should allow parsing flags', () => {
      expect(adapterArgs.parseFlags).toHaveBeenCalled();
    });
  });

  describe('with cache', () => {
    const adapterArgs = {
      cacheIdentifier: 'session',
      url: 'https://localhost:8080/graphql',
      user: { key: 'initial-user' },
      query: 'query AllFeatures { flags: allFeatures { name \n value} }',
      getQueryVariables: vi.fn(() => ({ userId: '123' })),
      getRequestHeaders: vi.fn(() => ({})),
      parseFlags: vi.fn((flags) => flags),
      fetcher: vi.fn().mockResolvedValue({
        json: () =>
          Promise.resolve({ data: { enabled: true, disabled: false } }),
      }),
    };
    let configurationResult;
    let adapterEventHandlers;

    beforeEach(async () => {
      sessionStorage.getItem.mockReturnValueOnce(
        JSON.stringify({ cached: true })
      );
      adapterEventHandlers = createAdapterEventHandlers();
      vi.useFakeTimers();
      configurationResult = await adapter.configure(
        adapterArgs,
        adapterEventHandlers
      );
    });

    afterEach(() => {
      vi.clearAllTimers();
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
        `@flopflip/graphql-adapter/${encodeCacheContext(adapterArgs.user)}/flags`
      );

      expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
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
            `@flopflip/graphql-adapter/${encodeCacheContext(adapterArgs.user)}/flags`
          )
        )
      ).toStrictEqual({ disabled: false, enabled: true });
    });

    it('should flush fetched flags', () => {
      expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
        id: adapter.id,
        flags: {
          enabled: true,
          disabled: false,
        },
      });
    });

    describe('with lazy cache mode', () => {
      beforeEach(async () => {
        sessionStorage.getItem.mockReturnValueOnce(
          JSON.stringify({ cached: true })
        );
        adapterEventHandlers = createAdapterEventHandlers();
        vi.useFakeTimers();
        configurationResult = await adapter.configure(
          adapterArgs,
          adapterEventHandlers
        );
      });

      it('should only flush cached but not updated flags', () => {
        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
          id: adapter.id,
          flags: expect.objectContaining({
            cached: true,
          }),
        });

        expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
          id: adapter.id,
          flags: expect.not.objectContaining({
            updated: true,
          }),
        });
      });
    });
  });

  describe('when updating flags', () => {
    const updatedFlags = { fooFlag: true, barFlag: false };

    beforeEach(() => {
      // From `configure`
      adapterEventHandlers.onFlagsStateChange.mockClear();

      adapter.updateFlags(updatedFlags);
    });

    it('should invoke but not trigger `warning`', () => {
      expect(warning).toHaveBeenCalledWith(true, expect.any(String));
    });

    it('should invoke `onFlagsStateChange`', () => {
      expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
    });

    it('should invoke `onFlagsStateChange` with `updatedFlags`', () => {
      expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
        id: adapter.id,
        flags: expect.objectContaining(updatedFlags),
      });
    });

    describe('when flags are not normalized', () => {
      const nonNormalizedUpdatedFlags = {
        'flag-a-1': false,
        flag_b: null,
      };
      beforeEach(() => {
        // From `configure`
        adapterEventHandlers.onFlagsStateChange.mockClear();

        adapter.updateFlags(nonNormalizedUpdatedFlags);
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

        adapter.updateFlags(updatedFlags, { lockFlags: true });

        adapter.updateFlags({ fooFlag: false });
      });

      it('should not update the locked flag', () => {
        expect(adapter.getFlag('fooFlag')).toEqual(true);
      });
    });
  });

  describe('when reconfiguring', () => {
    const user = { id: 'bar' };

    beforeEach(async () => {
      configurationResult = await adapter.reconfigure({
        ...adapterArgs,
        user,
        cacheIdentifier: 'session',
      });
    });

    it('should resolve to a successful initialization status', () => {
      expect(configurationResult).toEqual(
        expect.objectContaining({
          initializationStatus: 0,
        })
      );
    });

    it('should update the user', () => {
      expect(adapter.getUser()).toEqual(user);
    });

    it('should invoke `onFlagsStateChange`', () => {
      expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalled();
    });

    it('should invoke `onFlagsStateChange` with all flags', () => {
      expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
        id: adapter.id,
        flags: {
          barFlag: false,
          disabled: false,
          enabled: true,
          flagA1: false,
          flagB: false,
          fooFlag: true,
        },
      });
    });

    it('should reset cache', () => {
      expect(sessionStorage.removeItem).toHaveBeenCalledWith(
        `@flopflip/graphql-adapter/${encodeCacheContext(adapterArgs.user)}/flags`
      );
    });
  });

  describe('when resetting', () => {
    const updatedFlags = { fooFlag: true, barFlag: false };

    beforeEach(() => {
      adapter.updateFlags(updatedFlags);

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
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith({
        id: adapter.id,
        status: expect.objectContaining({
          configurationStatus: AdapterConfigurationStatus.Configuring,
        }),
      });
    });

    it('should indicate that the adapter is not configured', () => {
      expect(
        adapter.getIsConfigurationStatus(AdapterConfigurationStatus.Configured)
      ).toBe(false);
    });

    it('should invoke `onStatusStateChange` with configured', () => {
      expect(adapterEventHandlers.onStatusStateChange).toHaveBeenCalledWith({
        id: adapter.id,
        status: expect.objectContaining({
          configurationStatus: AdapterConfigurationStatus.Configuring,
        }),
      });
    });
  });
});

describe('exposeGlobally', () => {
  it('should expose `adapter` globally', () => {
    const global = getGlobalThis();

    expect(global).toHaveProperty('__flopflip__.graphql', adapter);
  });
});
