import {
  AdapterInitializationStatus,
  type TAdapterConfiguration,
  type TAdapterInterface,
  type TAdapterArgs,
} from '@flopflip/types';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  configureAdapter,
  reconfigureAdapter,
} from './configure-adapter-utility';

/**
 * Mock adapter factory for testing
 */
function createMockAdapter(): TAdapterInterface<TAdapterArgs> {
  return {
    id: 'test-adapter',
    configure: vi.fn(),
    reconfigure: vi.fn(),
    subscribe: vi.fn(),
    unsubscribe: vi.fn(),
    getIsConfigurationStatus: vi.fn(() => true),
  };
}

describe('configureAdapter utility', () => {
  let mockAdapter: TAdapterInterface<TAdapterArgs>;
  const testArgs = { userId: 'test-user' };

  beforeEach(() => {
    mockAdapter = createMockAdapter();
  });

  describe('configureAdapter', () => {
    it('should call adapter.configure with correct arguments', async () => {
      const configuration: TAdapterConfiguration = {
        initializationStatus: AdapterInitializationStatus.Succeeded,
      };
      vi.mocked(mockAdapter.configure).mockResolvedValue(configuration);

      await configureAdapter(mockAdapter, testArgs);

      expect(mockAdapter.configure).toHaveBeenCalledWith(testArgs, {
        onFlagsStateChange: undefined,
        onStatusStateChange: undefined,
      });
    });

    it('should return successful result when configuration succeeds', async () => {
      const configuration: TAdapterConfiguration = {
        initializationStatus: AdapterInitializationStatus.Succeeded,
      };
      vi.mocked(mockAdapter.configure).mockResolvedValue(configuration);

      const result = await configureAdapter(mockAdapter, testArgs);

      expect(result).toEqual({
        isSuccessful: true,
        wasInitializationSuccessful: true,
      });
    });

    it('should handle configuration without initializationStatus', async () => {
      vi.mocked(mockAdapter.configure).mockResolvedValue({});

      const result = await configureAdapter(mockAdapter, testArgs);

      expect(result).toEqual({
        isSuccessful: true,
        wasInitializationSuccessful: true,
      });
    });

    it('should return failure result when configuration fails', async () => {
      vi.mocked(mockAdapter.configure).mockRejectedValue(
        new Error('Configuration failed')
      );

      const result = await configureAdapter(mockAdapter, testArgs);

      expect(result).toEqual({
        isSuccessful: false,
        wasInitializationSuccessful: false,
      });
    });

    it('should invoke onFlagsStateChange callback when provided', async () => {
      const configuration: TAdapterConfiguration = {
        initializationStatus: AdapterInitializationStatus.Succeeded,
      };
      const onFlagsStateChange = vi.fn();
      vi.mocked(mockAdapter.configure).mockResolvedValue(configuration);

      await configureAdapter(mockAdapter, testArgs, {
        onFlagsStateChange,
      });

      expect(mockAdapter.configure).toHaveBeenCalledWith(testArgs, {
        onFlagsStateChange,
        onStatusStateChange: undefined,
      });
    });

    it('should invoke onStatusStateChange callback when provided', async () => {
      const configuration: TAdapterConfiguration = {
        initializationStatus: AdapterInitializationStatus.Succeeded,
      };
      const onStatusStateChange = vi.fn();
      vi.mocked(mockAdapter.configure).mockResolvedValue(configuration);

      await configureAdapter(mockAdapter, testArgs, {
        onStatusStateChange,
      });

      expect(mockAdapter.configure).toHaveBeenCalledWith(testArgs, {
        onFlagsStateChange: undefined,
        onStatusStateChange,
      });
    });

    it('should handle initialization failure status', async () => {
      const configuration: TAdapterConfiguration = {
        initializationStatus: AdapterInitializationStatus.Failed,
      };
      vi.mocked(mockAdapter.configure).mockResolvedValue(configuration);

      const result = await configureAdapter(mockAdapter, testArgs);

      expect(result).toEqual({
        isSuccessful: true,
        wasInitializationSuccessful: false,
      });
    });
  });

  describe('reconfigureAdapter', () => {
    it('should call adapter.reconfigure with correct arguments', async () => {
      const reconfiguration: TAdapterConfiguration = {
        initializationStatus: AdapterInitializationStatus.Succeeded,
      };
      vi.mocked(mockAdapter.reconfigure).mockResolvedValue(reconfiguration);

      await reconfigureAdapter(mockAdapter, testArgs);

      expect(mockAdapter.reconfigure).toHaveBeenCalledWith(testArgs, {
        onFlagsStateChange: undefined,
        onStatusStateChange: undefined,
      });
    });

    it('should return successful result when reconfiguration succeeds', async () => {
      const reconfiguration: TAdapterConfiguration = {
        initializationStatus: AdapterInitializationStatus.Succeeded,
      };
      vi.mocked(mockAdapter.reconfigure).mockResolvedValue(reconfiguration);

      const result = await reconfigureAdapter(mockAdapter, testArgs);

      expect(result).toEqual({
        isSuccessful: true,
        wasInitializationSuccessful: true,
      });
    });

    it('should return failure result when reconfiguration fails', async () => {
      vi.mocked(mockAdapter.reconfigure).mockRejectedValue(
        new Error('Reconfiguration failed')
      );

      const result = await reconfigureAdapter(mockAdapter, testArgs);

      expect(result).toEqual({
        isSuccessful: false,
        wasInitializationSuccessful: false,
      });
    });

    it('should handle reconfiguration without initializationStatus', async () => {
      vi.mocked(mockAdapter.reconfigure).mockResolvedValue({});

      const result = await reconfigureAdapter(mockAdapter, testArgs);

      expect(result).toEqual({
        isSuccessful: true,
        wasInitializationSuccessful: true,
      });
    });
  });
});
