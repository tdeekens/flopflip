/**
 * Hook for checking if a feature flag is enabled (boolean true).
 *
 * This hook provides a simple, ergonomic API for checking boolean feature flags.
 * It automatically normalizes flag names and returns false for:
 * - Missing flags
 * - Unconfigured adapters
 * - Variant/multivariate flags (non-boolean values)
 *
 * The hook subscribes to adapter updates and re-renders when flag values change.
 *
 * **Note**: This hook should be used with `@flopflip/react-redux` or `@flopflip/react-broadcast`
 * which provide the necessary context for flag state management.
 *
 * @param flagName - The name of the feature flag to check
 * @returns `true` if the flag is explicitly enabled, `false` otherwise
 *
 * @example
 * ```typescript
 * import { useFeatureToggle } from '@flopflip/react';
 *
 * function FeatureComponent() {
 *   const isNewUIEnabled = useFeatureToggle('newUI');
 *
 *   return (
 *     <div>
 *       {isNewUIEnabled ? <NewUI /> : <LegacyUI />}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link useFeatureToggles} for accessing all flags
 * @see {@link useFlagVariation} for variant/multivariate flags
 */
export function useFeatureToggle(_flagName: string): boolean {
  // This is a stub implementation. The actual implementation should come
  // from the state management layer (@flopflip/react-redux or @flopflip/react-broadcast).
  // This ensures the hook signature is available and users can import it,
  // but the real implementation is in the integrations.

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.warn(
      `useFeatureToggle is being called without a state management integration. ` +
        `Please use @flopflip/react-redux or @flopflip/react-broadcast to provide flag state.`
    );
  }

  return false;
}
