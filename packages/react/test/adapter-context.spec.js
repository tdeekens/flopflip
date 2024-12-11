import { AdapterConfigurationStatus } from '@flopflip/types';
import { describe, expect, it } from 'vitest';

import { selectAdapterConfigurationStatus } from '../src/adapter-context';

describe('selectAdapterConfigurationStatus', () => {
  describe('when configured', () => {
    it('should indicate ready state', () => {
      expect(
        selectAdapterConfigurationStatus({
          memory: {
            configurationStatus: AdapterConfigurationStatus.Configured,
          },
        })
      ).toEqual(
        expect.objectContaining({
          isReady: true,
        })
      );
    });
    it('should indicate configured state', () => {
      expect(
        selectAdapterConfigurationStatus({
          memory: {
            configurationStatus: AdapterConfigurationStatus.Configured,
          },
        })
      ).toEqual(
        expect.objectContaining({
          isConfigured: true,
        })
      );
    });
  });
  describe('when configuring', () => {
    it('should indicate configuring state', () => {
      expect(
        selectAdapterConfigurationStatus({
          memory: {
            configurationStatus: AdapterConfigurationStatus.Configuring,
          },
        })
      ).toEqual(
        expect.objectContaining({
          isConfiguring: true,
        })
      );
    });
    it('should not indicate configured state', () => {
      expect(
        selectAdapterConfigurationStatus({
          memory: {
            configurationStatus: AdapterConfigurationStatus.Configuring,
          },
        })
      ).toEqual(
        expect.objectContaining({
          isConfigured: false,
        })
      );
    });
  });
  describe('when unconfigured', () => {
    it('should indicate unconfigured', () => {
      expect(
        selectAdapterConfigurationStatus({
          memory: {
            configurationStatus: AdapterConfigurationStatus.Unconfigured,
          },
        })
      ).toEqual(
        expect.objectContaining({
          isUnconfigured: true,
        })
      );
    });
  });
  describe('with multiple adapters and one of interest', () => {
    it('should indicate ready state for one', () => {
      expect(
        selectAdapterConfigurationStatus(
          {
            memory: {
              configurationStatus: AdapterConfigurationStatus.Configured,
            },
            http: {
              configurationStatus: AdapterConfigurationStatus.Unconfigured,
            },
          },
          ['memory']
        )
      ).toEqual(
        expect.objectContaining({
          isReady: true,
        })
      );
    });
    it('should indicate unconfigured state for another', () => {
      expect(
        selectAdapterConfigurationStatus(
          {
            memory: {
              configurationStatus: AdapterConfigurationStatus.Configured,
            },
            http: {
              configurationStatus: AdapterConfigurationStatus.Unconfigured,
            },
          },
          ['http']
        )
      ).toEqual(
        expect.objectContaining({
          isUnconfigured: true,
        })
      );
    });
  });
});
