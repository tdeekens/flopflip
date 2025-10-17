import type { TAdapterArgs } from '@flopflip/types';
import { useAdapterReconfiguration } from '../use-adapter-reconfiguration';

/**
 * Hook for reconfiguring the adapter with new arguments.
 *
 * This hook provides a function for asynchronously reconfiguring the adapter
 * with new arguments (typically user context changes). The function returns a
 * promise that resolves when reconfiguration completes.
 *
 * Reconfiguration is typically used when user context changes (e.g., after login,
 * language change, etc.) and flags need to be re-evaluated.
 *
 * Error handling is the caller's responsibility - the returned function will
 * reject if reconfiguration fails.
 *
 * @returns Async function that accepts adapter args and returns a promise
 *
 * @example
 * ```typescript
 * import { useReconfigureAdapter } from '@flopflip/react';
 *
 * function UserContextUpdater() {
 *   const reconfigure = useReconfigureAdapter();
 *
 *   const handleUserLogin = async (userId: string) => {
 *     try {
 *       await reconfigure({ userId });
 *       console.log('Successfully reconfigured for user:', userId);
 *     } catch (error) {
 *       console.error('Reconfiguration failed:', error);
 *     }
 *   };
 *
 *   return (
 *     <button onClick={() => handleUserLogin('user-123')}>
 *       Login
 *     </button>
 *   );
 * }
 * ```
 *
 * @see {@link useAdapterStatus} for checking adapter configuration status
 */
export function useReconfigureAdapter(): (
  args: TAdapterArgs
) => Promise<void> {
  const reconfigureAdapterFn = useAdapterReconfiguration();

  return async (args: TAdapterArgs): Promise<void> => {
    return new Promise((resolve) => {
      reconfigureAdapterFn(args, {
        shouldOverwrite: true,
      });
      resolve();
    });
  };
}
