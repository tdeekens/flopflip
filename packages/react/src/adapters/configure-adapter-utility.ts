import {
  AdapterInitializationStatus,
  type TAdapterConfiguration,
  type TAdapterEventHandlers,
  type TAdapterArgs,
  type TAdapterInterface,
} from '@flopflip/types';
import warning from 'tiny-warning';

/**
 * Configuration result that indicates whether initialization succeeded
 */
export interface TConfigureAdapterResult {
  readonly isSuccessful: boolean;
  readonly wasInitializationSuccessful: boolean;
}

/**
 * Configures or reconfigures an adapter with callbacks for state changes.
 *
 * This utility centralizes the adapter configuration logic that's shared between
 * initial configuration and reconfiguration effects.
 *
 * @param adapter - The adapter instance to configure
 * @param adapterArgs - Arguments to pass to the adapter configuration
 * @param callbacks - Optional callbacks for flag and status state changes
 * @returns Promise that resolves when configuration completes
 *
 * @example
 * ```typescript
 * await configureAdapter(adapter, { userId: 'user-123' }, {
 *   onFlagsStateChange: (flagsState) => console.log('Flags changed'),
 *   onStatusStateChange: (statusState) => console.log('Status changed'),
 * });
 * ```
 */
export async function configureAdapter(
  adapter: TAdapterInterface<TAdapterArgs>,
  adapterArgs: TAdapterArgs,
  callbacks?: {
    readonly onFlagsStateChange?: TAdapterEventHandlers['onFlagsStateChange'];
    readonly onStatusStateChange?: TAdapterEventHandlers['onStatusStateChange'];
  }
): Promise<TConfigureAdapterResult> {
  try {
    const configuration: TAdapterConfiguration =
      await adapter.configure(adapterArgs, {
        onFlagsStateChange: callbacks?.onFlagsStateChange,
        onStatusStateChange: callbacks?.onStatusStateChange,
      });

    /**
     * The configuration can be `undefined` when working with old adapters.
     * In this case, we assume the initialization succeeded.
     */
    const isAdapterWithoutInitializationStatus =
      !configuration?.initializationStatus;

    const wasInitializationSuccessful =
      isAdapterWithoutInitializationStatus ||
      configuration.initializationStatus ===
        AdapterInitializationStatus.Succeeded;

    return {
      isSuccessful: true,
      wasInitializationSuccessful,
    };
  } catch (error) {
    warning(false, '@flopflip/react: adapter could not be configured.');

    return {
      isSuccessful: false,
      wasInitializationSuccessful: false,
    };
  }
}

/**
 * Reconfigures an adapter with new arguments and callbacks.
 *
 * This is a specialized version of configureAdapter for use with adapter.reconfigure().
 *
 * @param adapter - The adapter instance to reconfigure
 * @param adapterArgs - New arguments for reconfiguration
 * @param callbacks - Optional callbacks for state changes
 * @returns Promise with reconfiguration result
 */
export async function reconfigureAdapter(
  adapter: TAdapterInterface<TAdapterArgs>,
  adapterArgs: TAdapterArgs,
  callbacks?: {
    readonly onFlagsStateChange?: TAdapterEventHandlers['onFlagsStateChange'];
    readonly onStatusStateChange?: TAdapterEventHandlers['onStatusStateChange'];
  }
): Promise<TConfigureAdapterResult> {
  try {
    const reconfiguration: TAdapterConfiguration =
      await adapter.reconfigure(adapterArgs, {
        onFlagsStateChange: callbacks?.onFlagsStateChange,
        onStatusStateChange: callbacks?.onStatusStateChange,
      });

    /**
     * Same handling as configureAdapter for compatibility with old adapters.
     */
    const isAdapterWithoutInitializationStatus =
      !reconfiguration?.initializationStatus;

    const wasInitializationSuccessful =
      isAdapterWithoutInitializationStatus ||
      reconfiguration.initializationStatus ===
        AdapterInitializationStatus.Succeeded;

    return {
      isSuccessful: true,
      wasInitializationSuccessful,
    };
  } catch (error) {
    warning(false, '@flopflip/react: adapter could not be reconfigured.');

    return {
      isSuccessful: false,
      wasInitializationSuccessful: false,
    };
  }
}
