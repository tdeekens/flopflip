# Design Document: React Hooks Composition Refactor

**Change ID**: `refactor-react-hooks-composition`

**Date**: 2025-10-17

---

## Architectural Decisions

### 1. Internal Hook Return Type Refactoring

**Decision**: Replace tuple returns with named object returns for internal hooks.

**Rationale**:
- **Readability**: Named fields are self-documenting
- **Type Safety**: Eliminates magic number indexing and tuple position dependencies
- **Maintenance**: Easier to add/remove values without breaking positional contracts
- **Error Prevention**: Reduced risk of swapping positional values during refactoring

**Example**:
```typescript
// Before (tuple)
const [ref, setter, getIsConfigured, getNeedsInit] = useAdapterStateRef();

// After (named object)
const { adapterStateRef, setAdapterState, getIsAdapterConfigured, getDoesAdapterNeedInitialConfiguration } = useAdapterStateRef();
```

**Trade-offs**:
- Slightly more verbose destructuring syntax
- Minor performance impact (negligible in practice)
- Worth the improved maintainability

---

### 2. Configuration Logic Extraction

**Decision**: Extract the adapter configuration pattern into a shared utility function.

**Rationale**:
- **DRY Principle**: ~40 lines of identical logic duplicated between `useDefaultFlagsEffect` and `useConfigurationEffect`
- **Maintainability**: Future changes to configuration logic only need to be made in one place
- **Testability**: Configuration logic can be tested independently

**Pattern**:
```typescript
// New utility: configureAdapter(args)
async function configureAdapter(
  adapter: TAdapterInterface,
  adapterArgs: TAdapterArgs,
  callbacks: {
    onFlagsStateChange?: TOnFlagsStateChange;
    onStatusStateChange?: TOnStatusStateChange;
  }
): Promise<void> {
  // Extracted configuration logic
  return adapter.configure(adapterArgs, callbacks)
    .then(...)
    .catch(...);
}
```

**Usage**:
```typescript
// In both effects, replace duplicated code with:
await configureAdapter(adapter, adapterArgs, { onFlagsStateChange, onStatusStateChange });
```

---

### 3. Consumer Hook Layer

**Decision**: Add a new layer of higher-level consumer hooks that wrap low-level context/state APIs.

**Rationale**:
- **Current Gap**: Only `useAdapterContext` and `useAdapterReconfiguration` are exported; both are thin wrappers
- **User Experience**: Developers want simple APIs like `useFeatureToggle(flagName)` not `useAdapterContext().flags[flagName]`
- **Encapsulation**: Hide implementation details (adapter contexts, flag normalization, etc.)

**New Hooks**:
```typescript
// 1. Simple boolean flag check
useFeatureToggle(flagName: string): boolean

// 2. Get all flags from primary adapter
useFeatureToggles(): TFlags

// 3. Get specific flag variation with type safety
useFlagVariation<T>(flagName: string, defaultValue?: T): T

// 4. Get adapter status (loading, configured, errored)
useAdapterStatus(): { isConfigured: boolean; isLoading: boolean; }

// 5. Async reconfiguration with error handling
useReconfigureAdapter(): (args: TAdapterArgs) => Promise<void>
```

**Implementation**:
```typescript
export const useFeatureToggle = (flagName: string): boolean => {
  const context = useAdapterContext();
  return getFlagVariation(context.flags, flagName) === true;
};
```

---

### 4. Hook Parameter Optimization

**Decision**: Group related parameters in internal hooks using configuration objects.

**Rationale**:
- **Readability**: Clear semantic grouping of concerns
- **Maintainability**: Easier to add optional parameters without breaking existing calls
- **Type Safety**: Configuration object can have JSDoc with descriptions

**Example**:
```typescript
// Before
useConfigurationEffect({
  adapter, shouldDeferAdapterConfiguration, getDoesAdapterNeedInitialConfiguration,
  setAdapterState, onFlagsStateChange, onStatusStateChange, applyAdapterArgs,
  getAdapterArgsForConfiguration, getIsAdapterConfigured, pendingAdapterArgsRef, appliedAdapterArgs,
})

// After (conceptual grouping)
useConfigurationEffect({
  // Adapter instance
  adapter,

  // State accessors/setters
  state: { getIsAdapterConfigured, getDoesAdapterNeedInitialConfiguration, setAdapterState, adapterStateRef },

  // Callbacks
  callbacks: { onFlagsStateChange, onStatusStateChange },

  // Args management
  args: { getAdapterArgsForConfiguration, applyAdapterArgs, pendingAdapterArgsRef, appliedAdapterArgs },

  // Configuration behavior
  config: { shouldDeferAdapterConfiguration },
})
```

---

### 5. Type Safety Improvements

**Decision**: Use TypeScript labeled tuples or strict type definitions to eliminate positional indexing.

**Rationale**:
- **Type Errors**: Prevent runtime errors from accessing wrong positions
- **IntelliSense**: Better IDE autocomplete and documentation
- **Future-Proof**: Making type changes won't break existing code silently

**Before**:
```typescript
type TUseAdapterStateRefReturn = [
  React.MutableRefObject<TAdapterStates>,
  (nextAdapterState: TAdapterStates) => void,
  () => boolean,
  () => boolean,
];

// Usage (position-dependent)
const result = useAdapterStateRef();
const ref = result[0];  // ❌ What's at index 0?
const setter = result[1]; // ❌ What's at index 1?
```

**After**:
```typescript
type TUseAdapterStateRefReturn = {
  adapterStateRef: React.MutableRefObject<TAdapterStates>;
  setAdapterState: (nextAdapterState: TAdapterStates) => void;
  getIsAdapterConfigured: () => boolean;
  getDoesAdapterNeedInitialConfiguration: () => boolean;
};

// Usage (self-documenting)
const { adapterStateRef, setAdapterState } = useAdapterStateRef(); // ✅ Clear intent
```

---

### 6. Backward Compatibility Strategy

**Decision**: Maintain existing public APIs while adding new ones, with clear migration paths.

**Rationale**:
- **Stability**: Existing users' code continues to work
- **Adoption**: Users can migrate at their own pace
- **Testing**: Can validate both old and new implementations during transition

**Strategy**:
1. Add new hooks alongside existing ones (no removal)
2. Export existing hooks with `@deprecated` JSDoc comments pointing to new alternatives
3. Keep old implementations functional but encourage migration
4. After 2-3 major versions, consider removing deprecated APIs

---

### 7. Dependency Array Management

**Decision**: Review and justify all `biome-ignore` suppressions; refactor to eliminate false positives where possible.

**Rationale**:
- **Linter Trust**: Linter suppressions indicate code smell
- **Correctness**: Missing dependencies can cause stale closures and subtle bugs
- **Maintainability**: Clear dependencies make hook behavior predictable

**Approach**:
1. Audit each suppression (currently 8 instances)
2. Categorize as: legitimate (document why), false positive (fix), or refactorable
3. For legitimate suppressions, add explanatory comments with reasoning
4. For false positives, refactor to eliminate the dependency issue

---

## Implementation Order

### Phase 1: Preparation & Testing
1. Add comprehensive test coverage for existing internal hooks
2. Document current behavior with snapshot tests

### Phase 2: Configuration Logic Extraction
1. Create `src/adapters/configure-adapter-utility.ts`
2. Extract shared logic from both effect hooks
3. Update tests to validate extraction

### Phase 3: Internal Hook Refactoring
1. Refactor `useAdapterStateRef()` to return named object
2. Refactor `usePendingAdapterArgsRef()` to return named object
3. Update all internal effect hooks to use new returns
4. Update integration tests

### Phase 4: Consumer Hooks
1. Create new hooks in `src/hooks/`
2. Add comprehensive tests and JSDoc
3. Update main index.ts exports
4. Add migration guide to docs

### Phase 5: Documentation & Migration
1. Update JSDoc comments with deprecation notices
2. Add code examples for new APIs
3. Update README with new hook usage
4. Create migration guide for existing users

---

## Risk Assessment

### Medium Risks
- **Internal API Refactoring**: Could break undocumented dependencies if any users relied on internal hooks
  - *Mitigation*: Internal hooks are not documented as public; refactoring is expected for internal APIs

### Low Risks
- **Bundle Size**: New consumer hooks could increase size
  - *Mitigation*: Hooks are tree-shakeable; typical consumers use only 1-2 hooks

- **Performance**: Object returns vs tuple returns
  - *Mitigation*: Performance impact negligible; hooks run once per component mount

---

## Success Metrics

1. **Code Quality**:
   - Code duplication reduced by >50% (from ~80 lines to <40)
   - All `biome-ignore` suppressions reviewed and documented
   - Type safety: zero tuple indexing magic numbers

2. **API Usability**:
   - New consumer hooks adopted by >50% of users within 3 months
   - Reduced number of support questions about context access patterns

3. **Maintainability**:
   - New contributors can understand hook patterns within 1 day
   - Onboarding documentation clarity score +20%

4. **Performance**:
   - No bundle size increase (same or smaller)
   - No regression in hook execution time (benchmarks)

5. **Testing**:
   - Test coverage maintained at >95%
   - New hooks have 100% coverage
   - All integration tests pass

---

## Open Questions

1. **State Machine Library**: Should we adopt `xstate` for more explicit state management, or keep the current implicit approach?
   - Impact: Medium (refactoring effort) | Value: Medium-High (clarity)

2. **Internal Hook Exports**: Should we export internal hooks (with `_` prefix) for advanced users and testing?
   - Impact: Low (additive change) | Value: Medium (flexibility)

3. **Feature Detection**: Should new hooks detect which adapter is in use to provide better error messages?
   - Impact: Low | Value: Low-Medium (DX improvement)

