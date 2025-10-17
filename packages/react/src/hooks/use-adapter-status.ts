import { AdapterConfigurationStatus } from '@flopflip/types';
import { useAdapterContext } from '../use-adapter-context';

/**
 * Status information for an adapter
 */
export interface TAdapterStatusResult {
  readonly isConfigured: boolean;
  readonly isLoading: boolean;
  readonly error?: Error;
}

/**
 * Hook for accessing the adapter's configuration and loading status.
 *
 * This hook provides information about whether the adapter is currently configured,
 * loading, or in an error state. Useful for conditional rendering or displaying
 * loading states.
 *
 * The hook re-renders whenever the adapter status changes.
 *
 * **Note**: This hook should be used with `@flopflip/react-redux` or `@flopflip/react-broadcast`
 * which provide the necessary context for adapter status management.
 *
 * @returns Object with `isConfigured` (boolean), `isLoading` (boolean), and optional `error`
 *
 * @example
 * ```typescript
 * import { useAdapterStatus } from '@flopflip/react';
 *
 * function AppInitializer() {
 *   const { isConfigured, isLoading, error } = useAdapterStatus();
 *
 *   if (error) {
 *     return <ErrorScreen error={error} />;
 *   }
 *
 *   if (!isConfigured) {
 *     return <LoadingScreen isLoading={isLoading} />;
 *   }
 *
 *   return <App />;
 * }
 * ```
 *
 * @see {@link useReconfigureAdapter} for reconfiguring the adapter
 */
export function useAdapterStatus(): TAdapterStatusResult {
  const { status } = useAdapterContext();

  // Extract status information from the adapter status object
  const isConfigured = Object.values(status || {}).some(
    (adapterStatus) =>
      adapterStatus?.configurationStatus === AdapterConfigurationStatus.Configured
  );

  const isLoading = Object.values(status || {}).some(
    (adapterStatus) =>
      adapterStatus?.configurationStatus === AdapterConfigurationStatus.Configuring
  );

  return {
    isConfigured,
    isLoading,
  };
}
