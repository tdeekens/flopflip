import { AdapterConfigurationStatus, cacheIdentifiers } from '@flopflip/types';
import getGlobalThis from 'globalthis';
import warning from 'tiny-warning';

import adapter from './adapter';

jest.mock('tiny-warning');

const createAdapterEventHandlers = (custom = {}) => ({
  onFlagsStateChange: jest.fn(),
  onStatusStateChange: jest.fn(),
  ...custom,
});

describe('when configuring', () => {
  let adapterEventHandlers;

  beforeEach(() => {
    adapterEventHandlers = createAdapterEventHandlers();
  });

  describe('when not configured', () => {
    let adapterArgs = {};

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
  let adapterArgs = {
    execute: jest.fn().mockResolvedValue({ enabled: true, disabled: false }),
  };
  let configurationResult;
  let adapterEventHandlers;

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('without cache', () => {
    beforeEach(async () => {
      adapterEventHandlers = createAdapterEventHandlers();
      jest.useFakeTimers();
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
  });

  describe('with cache', () => {
    const cachePrefix = 'test';
    let adapterArgs = {
      cacheIdentifier: 'session',
      execute: jest.fn().mockResolvedValue({ enabled: true, disabled: false }),
    };
    let configurationResult;
    let adapterEventHandlers;

    beforeEach(async () => {
      sessionStorage.getItem.mockReturnValueOnce(
        JSON.stringify({ cached: true })
      );
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

    it('should restore cached flags', () => {
      expect(sessionStorage.getItem).toHaveBeenCalledWith('@flopflip__flags');

      expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
        id: adapter.id,
        flags: {
          cached: true,
        },
      });
    });

    it('should cache newly fetched flags', () => {
      expect(
        JSON.parse(sessionStorage.getItem('@flopflip__flags'))
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

    it('should invoke `onFlagsStateChange` with empty flags', () => {
      expect(adapterEventHandlers.onFlagsStateChange).toHaveBeenCalledWith({
        id: adapter.id,
        flags: {},
      });
    });

    it('should reset cache', () => {
      expect(sessionStorage.removeItem).toHaveBeenCalledWith(
        '@flopflip__flags'
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
    const globalThis = getGlobalThis();

    expect(globalThis).toHaveProperty('__flopflip__.http', adapter);
  });
});
