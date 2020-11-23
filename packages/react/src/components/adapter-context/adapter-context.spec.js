import { AdapterConfigurationStatus } from '@flopflip/types';
import { selecAdapterConfigurationStatus } from './adapter-context';

describe('selecAdapterConfigurationStatus', () => {
  describe('when configured', () => {
    it('should indicate ready state', () => {
      expect(
        selecAdapterConfigurationStatus(AdapterConfigurationStatus.Configured)
      ).toEqual(
        expect.objectContaining({
          isReady: true,
        })
      );
    });
    it('should indicate configured state', () => {
      expect(
        selecAdapterConfigurationStatus(AdapterConfigurationStatus.Configured)
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
        selecAdapterConfigurationStatus(AdapterConfigurationStatus.Configuring)
      ).toEqual(
        expect.objectContaining({
          isConfiguring: true,
        })
      );
    });
    it('should not indicate configured state', () => {
      expect(
        selecAdapterConfigurationStatus(AdapterConfigurationStatus.Configuring)
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
        selecAdapterConfigurationStatus(AdapterConfigurationStatus.Unconfigured)
      ).toEqual(
        expect.objectContaining({
          isUnconfigured: true,
        })
      );
    });
  });
});
