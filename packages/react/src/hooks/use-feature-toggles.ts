import type { TFlags } from '@flopflip/types';

/**
 * Hook for accessing all feature flags from the primary adapter.
 *
 * This hook returns an object containing all feature flags from the currently
 * configured adapter. Flags include both boolean toggles and variant values.
 *
 * The hook re-renders whenever any flag value changes.
 *
 * **Note**: This hook should be used with `@flopflip/react-redux` or `@flopflip/react-broadcast`
 * which provide the necessary context for flag state management.
 *
 * @returns Object containing all flags from the primary adapter, or empty object if not configured
 *
 * @example
 * ```typescript
 * import { useFeatureToggles } from '@flopflip/react';
 *
 * function FeatureDebugPanel() {
 *   const flags = useFeatureToggles();
 *
 *   return (
 *     <div>
 *       <h2>Active Flags</h2>
 *       <ul>
 *         {Object.entries(flags).map(([name, value]) => (
 *           <li key={name}>{name}: {String(value)}</li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link useFeatureToggle} for checking individual boolean flags
 * @see {@link useFlagVariation} for variant/multivariate flags with type safety
 */
export function useFeatureToggles(): TFlags {
  // This is a stub implementation. The actual implementation should come
  // from the state management layer (@flopflip/react-redux or @flopflip/react-broadcast).
  // This ensures the hook signature is available and users can import it,
  // but the real implementation is in the integrations.

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.warn(
      `useFeatureToggles is being called without a state management integration. ` +
        `Please use @flopflip/react-redux or @flopflip/react-broadcast to provide flag state.`
    );
  }

  return {};
}
