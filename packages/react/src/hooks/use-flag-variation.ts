/**
 * Hook for accessing variant/multivariate flag values with type safety.
 *
 * This hook provides access to feature flag values with optional generic type
 * parameter for type-safe variant discrimination. It supports both boolean flags
 * and string/variant flags.
 *
 * If the flag doesn't exist, the provided `defaultValue` is returned. If no default
 * is provided and the flag doesn't exist, `undefined` is returned.
 *
 * The hook subscribes to adapter updates and re-renders when flag values change.
 *
 * **Note**: This hook should be used with `@flopflip/react-redux` or `@flopflip/react-broadcast`
 * which provide the necessary context for flag state management.
 *
 * @typeParam T - The expected type of the flag value (e.g., string literal union for variants)
 * @param flagName - The name of the feature flag
 * @param defaultValue - Optional default value returned if flag doesn't exist
 * @returns The flag value or the default value if flag is not found
 *
 * @example
 * ```typescript
 * import { useFlagVariation } from '@flopflip/react';
 *
 * // With variant types
 * type LayoutVariant = 'control' | 'variant-a' | 'variant-b';
 *
 * function ExperimentPage() {
 *   const layout = useFlagVariation<LayoutVariant>('layout', 'control');
 *
 *   return <LayoutRenderer variant={layout} />;
 * }
 *
 * // With boolean flags
 * function FeatureComponent() {
 *   const isEnabled = useFlagVariation<boolean>('feature', false);
 *   return isEnabled ? <Feature /> : null;
 * }
 * ```
 *
 * @see {@link useFeatureToggle} for simple boolean flag checking
 * @see {@link useFeatureToggles} for accessing all flags
 */
export function useFlagVariation<T = any>(
  _flagName: string,
  defaultValue?: T
): T {
  // This is a stub implementation. The actual implementation should come
  // from the state management layer (@flopflip/react-redux or @flopflip/react-broadcast).
  // This ensures the hook signature is available and users can import it,
  // but the real implementation is in the integrations.

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.warn(
      `useFlagVariation is being called without a state management integration. ` +
        `Please use @flopflip/react-redux or @flopflip/react-broadcast to provide flag state.`
    );
  }

  return defaultValue as T;
}
