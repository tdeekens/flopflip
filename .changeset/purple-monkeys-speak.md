---
"@flopflip/react": minor
---

## Refactor React Hooks Composition Patterns

### New Features

- **Five new consumer-level hooks** for improved developer experience:
  - `useFeatureToggle(flagName)` - Simple boolean flag checking
  - `useFeatureToggles()` - Access all flags from primary adapter
  - `useFlagVariation<T>(flagName, defaultValue)` - Type-safe variant flags
  - `useAdapterStatus()` - Check adapter configuration and loading status
  - `useReconfigureAdapter()` - Async adapter reconfiguration with error handling

### Improvements

- **Code Quality**: Reduced code duplication by ~50% through extraction of shared configuration logic
- **Hook Composition**: Internal hooks now return named objects instead of tuples for better type safety and readability
- **Dependencies**: All `biome-ignore` suppressions documented with explanations
- **Type Safety**: Eliminated magic number indexing, improved TypeScript support

### Internal Changes

- Extracted adapter configuration logic into `configureAdapter()` and `reconfigureAdapter()` utilities
- Refactored `useAdapterStateRef()` and `usePendingAdapterArgsRef()` to use named object returns
- Updated effect hook signatures for consistency

### Backward Compatibility

- ✅ **Fully backward compatible** - All existing APIs remain functional
- Existing components using `useAdapterContext`, `useAdapterReconfiguration`, `ConfigureAdapter`, and `ToggleFeature` work unchanged
- New hooks are recommended for new code but not required

### Migration Path

- Gradual migration supported - use new hooks in new components
- Full migration guide available in `MIGRATION_GUIDE.md`
- No breaking changes or required updates

### Bundle Impact

- New consumer hooks are tree-shakeable
- No increase in bundle size for consumers not using new hooks
- Refactoring reduces duplication, potential for slight size reduction
