import { TAdapterConfigurationStatus } from '@flopflip/types';
import { selectAdapterConfigurationStatus } from './adapter-context';

describe('selectAdapterConfigurationStatus', () => {
  describe('when configured', () => {
    it('should indicate ready state', () => {
      expect(
        selectAdapterConfigurationStatus(TAdapterConfigurationStatus.Configured)
      ).toEqual(
        expect.objectContaining({
          isReady: true,
        })
      );
    });
    it('should indicate configured state', () => {
      expect(
        selectAdapterConfigurationStatus(TAdapterConfigurationStatus.Configured)
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
        selectAdapterConfigurationStatus(
          TAdapterConfigurationStatus.Configuring
        )
      ).toEqual(
        expect.objectContaining({
          isConfiguring: true,
        })
      );
    });
    it('should not indicate configured state', () => {
      expect(
        selectAdapterConfigurationStatus(
          TAdapterConfigurationStatus.Configuring
        )
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
        selectAdapterConfigurationStatus(
          TAdapterConfigurationStatus.Unconfigured
        )
      ).toEqual(
        expect.objectContaining({
          isUnconfigured: true,
        })
      );
    });
  });
});
