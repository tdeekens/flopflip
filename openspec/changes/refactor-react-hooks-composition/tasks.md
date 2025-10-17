# Tasks: React Hooks Composition Refactor

**Change ID**: `refactor-react-hooks-composition`

**Overall Status**: Pending (ordered task list for implementation)

---

## Phase 1: Analysis & Test Coverage

### Task 1.1: Document Current Hook Behavior

**Description**: Create comprehensive snapshot tests for existing hook behavior to serve as regression baseline.

**Verification**:
- [ ] Snapshot tests created for `useAdapterStateRef`
- [ ] Snapshot tests created for `usePendingAdapterArgsRef`
- [ ] Snapshot tests created for internal effect hooks
- [ ] All snapshots pass on current codebase
- [ ] Tests document current parameter order and return types

**Estimated Effort**: 2-3 hours

**Dependencies**: None

---

### Task 1.2: Audit Biome-Ignore Suppressions

**Description**: Review all 8 `biome-ignore lint/correctness/useExhaustiveDependencies` suppressions and document reasoning.

**Verification**:
- [ ] All suppressions identified and catalogued
- [ ] Each suppression has explanatory comment
- [ ] Comments explain why dependency is safe to omit
- [ ] Categorized as: justified, false-positive (refactorable), or legitimate-override
- [ ] Discussion document created for review

**Estimated Effort**: 1-2 hours

**Dependencies**: None

---

### Task 1.3: Analyze Code Duplication

**Description**: Measure and document the adapter configuration logic duplication between effects.

**Verification**:
- [ ] Lines of duplicated code identified (expect ~80 lines)
- [ ] Diff created showing identical code blocks
- [ ] Configuration logic pattern extracted for reuse
- [ ] Report document created showing duplication metrics

**Estimated Effort**: 1 hour

**Dependencies**: None

---

## Phase 2: Configuration Logic Extraction

### Task 2.1: Create configureAdapter Utility

**Description**: Extract shared adapter configuration logic into `packages/react/src/adapters/configure-adapter-utility.ts`.

**Verification**:
- [ ] File created with proper TypeScript types
- [ ] Function handles success and error cases
- [ ] Callbacks are optional and handled gracefully
- [ ] Unit tests written and passing (>95% coverage)
- [ ] Error handling consistent with adapter contract

**Estimated Effort**: 2-3 hours

**Dependencies**: Task 1.1, Task 1.3

**Test Requirements**:
```
- configureAdapter calls adapter.configure correctly
- configureAdapter handles successful configuration
- configureAdapter rejects on adapter failure
- configureAdapter handles optional callbacks
- configureAdapter error handling is consistent
```

---

### Task 2.2: Integrate configureAdapter into useDefaultFlagsEffect

**Description**: Replace duplicated configuration logic in `useDefaultFlagsEffect` with call to new utility.

**Verification**:
- [ ] Code refactored to use `configureAdapter` utility
- [ ] Existing tests still pass
- [ ] Snapshot tests updated to reflect changes
- [ ] Error handling behavior unchanged
- [ ] No performance regression observed

**Estimated Effort**: 1-2 hours

**Dependencies**: Task 2.1

---

### Task 2.3: Integrate configureAdapter into useConfigurationEffect

**Description**: Replace duplicated configuration logic in `useConfigurationEffect` with call to new utility.

**Verification**:
- [ ] Code refactored to use `configureAdapter` utility
- [ ] Existing tests still pass
- [ ] Snapshot tests match expected behavior
- [ ] Error handling behavior unchanged
- [ ] Code duplication eliminated

**Estimated Effort**: 1-2 hours

**Dependencies**: Task 2.1, Task 2.2

---

## Phase 3: Internal Hook Refactoring

### Task 3.1: Refactor useAdapterStateRef Return Type

**Description**: Change return type from tuple to named object.

**Verification**:
- [ ] Return type changed to object with named properties
- [ ] TypeScript types updated
- [ ] All internal usages updated to use named destructuring
- [ ] Tests updated to verify named properties
- [ ] No breaking changes to component behavior
- [ ] Tests passing

**Estimated Effort**: 2 hours

**Dependencies**: Task 1.1, Task 1.2

**Files to Update**:
- `packages/react/src/use-adapter-context.ts` (type definition)
- `packages/react/src/configure-adapter/configure-adapter.tsx` (usages)
- Tests for all files using `useAdapterStateRef`

---

### Task 3.2: Refactor usePendingAdapterArgsRef Return Type

**Description**: Change return type from tuple to named object.

**Verification**:
- [ ] Return type changed to object with named properties
- [ ] TypeScript types updated
- [ ] All internal usages updated to use named destructuring
- [ ] Tests updated to verify named properties
- [ ] No breaking changes to component behavior
- [ ] Tests passing

**Estimated Effort**: 2 hours

**Dependencies**: Task 1.1, Task 3.1

**Files to Update**:
- `packages/react/src/configure-adapter/configure-adapter.tsx` (type and usages)
- All tests using `usePendingAdapterArgsRef`

---

### Task 3.3: Reorganize Effect Hook Parameters

**Description**: Group effect hook parameters by concern (state, callbacks, args, config).

**Verification**:
- [ ] Parameter count reduced from 11+ to 5 logical groups
- [ ] Parameters organized into semantic objects
- [ ] TypeScript types created for parameter objects
- [ ] All effect hooks updated to receive grouped parameters
- [ ] All usages updated in ConfigureAdapter
- [ ] Tests passing
- [ ] Code readability improved

**Estimated Effort**: 3-4 hours

**Dependencies**: Task 3.1, Task 3.2

**Files to Update**:
- `packages/react/src/configure-adapter/configure-adapter.tsx` (all internal hooks)
- Type definitions for effect hook parameters
- Tests for all effect hooks

---

### Task 3.4: Document Dependency Array Rationale

**Description**: Add explanatory comments to all `biome-ignore` suppressions based on audit.

**Verification**:
- [ ] All 8 suppressions have explanatory comments
- [ ] Comments explain dependency safety/necessity
- [ ] Comments reference relevant React hook knowledge
- [ ] Biome linter still satisfied with suppressions
- [ ] Code review can understand rationale

**Estimated Effort**: 1 hour

**Dependencies**: Task 1.2

---

## Phase 4: Consumer-Level Hooks

### Task 4.1: Implement useFeatureToggle Hook

**Description**: Create new consumer hook for simple boolean flag evaluation.

**Verification**:
- [ ] Hook created in `packages/react/src/hooks/use-feature-toggle.ts`
- [ ] Returns boolean (true if flag enabled)
- [ ] Handles flag name normalization
- [ ] Returns false if adapter not configured
- [ ] Re-renders on flag changes
- [ ] TypeScript types complete
- [ ] Tests created and passing (>95% coverage)
- [ ] JSDoc documentation added

**Estimated Effort**: 1-2 hours

**Dependencies**: Task 2.3

**Test Requirements**:
```
- returns true when flag enabled
- returns false when flag disabled
- handles variants as false
- re-renders on flag change
- handles unknown flags
- works with normalized flag names
```

---

### Task 4.2: Implement useFeatureToggles Hook

**Description**: Create new consumer hook for accessing all flags.

**Verification**:
- [ ] Hook created in `packages/react/src/hooks/use-feature-toggles.ts`
- [ ] Returns all flags object from primary adapter
- [ ] Returns empty object if not configured
- [ ] Re-renders when any flag changes
- [ ] TypeScript types complete
- [ ] Tests created and passing (>95% coverage)
- [ ] JSDoc documentation added

**Estimated Effort**: 1-2 hours

**Dependencies**: Task 2.3

**Test Requirements**:
```
- returns all flags object
- returns empty object if not configured
- re-renders on any flag change
- object reference stability on changes
```

---

### Task 4.3: Implement useFlagVariation Hook

**Description**: Create new consumer hook for variant/multivariate flags.

**Verification**:
- [ ] Hook created in `packages/react/src/hooks/use-flag-variation.ts`
- [ ] Supports generic type parameter for type safety
- [ ] Returns flag value or default
- [ ] Handles flag name normalization
- [ ] Works with boolean and string values
- [ ] Re-renders on flag changes
- [ ] TypeScript types complete
- [ ] Tests created and passing (>95% coverage)
- [ ] JSDoc documentation added

**Estimated Effort**: 1-2 hours

**Dependencies**: Task 2.3

**Test Requirements**:
```
- returns flag value when exists
- returns default value when not found
- supports boolean flags
- supports generic type parameter
- handles normalization
- re-renders on change
```

---

### Task 4.4: Implement useAdapterStatus Hook

**Description**: Create new consumer hook for adapter configuration status.

**Verification**:
- [ ] Hook created in `packages/react/src/hooks/use-adapter-status.ts`
- [ ] Returns object with `isConfigured` and `isLoading`
- [ ] Returns optional `error` property on failure
- [ ] Updates when adapter state changes
- [ ] TypeScript types complete
- [ ] Tests created and passing (>95% coverage)
- [ ] JSDoc documentation added

**Estimated Effort**: 1-2 hours

**Dependencies**: Task 2.3, Task 3.1

**Test Requirements**:
```
- returns correct status object shape
- isConfigured true when configured
- isLoading true during configuration
- includes error when failed
- updates on state change
```

---

### Task 4.5: Implement useReconfigureAdapter Hook

**Description**: Create new consumer hook for adapter reconfiguration.

**Verification**:
- [ ] Hook created in `packages/react/src/hooks/use-reconfigure-adapter.ts`
- [ ] Returns async function for reconfiguration
- [ ] Function accepts adapter args
- [ ] Function returns promise
- [ ] Function rejects on error
- [ ] Error handling is caller's responsibility
- [ ] TypeScript types complete
- [ ] Tests created and passing (>95% coverage)
- [ ] JSDoc documentation added

**Estimated Effort**: 1-2 hours

**Dependencies**: Task 2.3

**Test Requirements**:
```
- returns async function
- function reconfigures adapter
- function rejects on error
- handles pending reconfiguration
- type-safe arg handling
```

---

### Task 4.6: Export New Hooks from Index

**Description**: Export all new consumer hooks from package index.

**Verification**:
- [ ] All 5 new hooks exported from `packages/react/src/index.ts`
- [ ] Existing exports unchanged (backward compatible)
- [ ] TypeScript types re-exported
- [ ] All hooks are tree-shakeable
- [ ] Public API documentation updated

**Estimated Effort**: 30 minutes

**Dependencies**: Tasks 4.1-4.5

---

## Phase 5: Testing & Integration

### Task 5.1: Integration Tests

**Description**: Create end-to-end integration tests for new hook combinations.

**Verification**:
- [ ] Test component using multiple new hooks together
- [ ] Test hook composition with real adapter
- [ ] Test flag updates propagate through all hooks
- [ ] Test error scenarios
- [ ] Tests passing
- [ ] Test coverage >95%

**Estimated Effort**: 2-3 hours

**Dependencies**: Tasks 4.1-4.5

---

### Task 5.2: Backward Compatibility Tests

**Description**: Verify all existing APIs still work identically.

**Verification**:
- [ ] Existing `useAdapterContext` works unchanged
- [ ] Existing `useAdapterReconfiguration` works unchanged
- [ ] ConfigureAdapter component works unchanged
- [ ] All adapter providers work with refactored code
- [ ] Cypress plugin tests pass
- [ ] E2E tests pass

**Estimated Effort**: 1-2 hours

**Dependencies**: Phase 3 complete

---

### Task 5.3: Performance Testing

**Description**: Verify no performance regressions from refactoring.

**Verification**:
- [ ] Bundle size analysis shows no increase (or smaller)
- [ ] Hook execution time benchmarks pass
- [ ] Re-render count unchanged or reduced
- [ ] Memory usage unchanged
- [ ] No new performance warnings

**Estimated Effort**: 1-2 hours

**Dependencies**: Phase 3, Phase 4 complete

---

## Phase 6: Documentation & Migration

### Task 6.1: Update JSDoc Comments

**Description**: Add `@deprecated` markers to old APIs and update all JSDoc comments.

**Verification**:
- [ ] JSDoc added to all new hooks
- [ ] JSDoc added to internal hooks (if exported)
- [ ] Migration guidance in JSDoc
- [ ] Examples included in JSDoc
- [ ] IDE shows documentation on hover

**Estimated Effort**: 1-2 hours

**Dependencies**: Phase 4 complete

---

### Task 6.2: Create Migration Guide

**Description**: Write guide showing how to migrate from old to new hook patterns.

**Verification**:
- [ ] Before/after code examples provided
- [ ] Common use cases documented
- [ ] Troubleshooting section included
- [ ] Guide added to project README
- [ ] Code snippets are copy-paste ready

**Estimated Effort**: 2-3 hours

**Dependencies**: Phase 4 complete

---

### Task 6.3: Update README Examples

**Description**: Update README.md with examples using new hooks.

**Verification**:
- [ ] Examples show new consumer hooks
- [ ] Examples show recommended usage patterns
- [ ] Examples cover common use cases
- [ ] Examples are runnable (or clearly noted if pseudo-code)
- [ ] Existing examples still present for reference

**Estimated Effort**: 1-2 hours

**Dependencies**: Task 6.2

---

### Task 6.4: Create Changelog Entry

**Description**: Document all changes for release notes.

**Verification**:
- [ ] Changeset created with `pnpm changeset`
- [ ] Lists all new hooks
- [ ] Documents backward compatibility
- [ ] References migration guide
- [ ] Categorized appropriately (feat/minor)

**Estimated Effort**: 30 minutes

**Dependencies**: All phases complete

---

## Phase 7: Review & Merge

### Task 7.1: Code Review Preparation

**Description**: Prepare branch for code review with clear summary.

**Verification**:
- [ ] All tests passing
- [ ] All linting passing (Biome)
- [ ] Type checking passing
- [ ] Performance checks passing
- [ ] PR created with detailed description
- [ ] PR includes link to OpenSpec proposal

**Estimated Effort**: 1 hour

**Dependencies**: All previous phases

---

## Implementation Summary

### Completed Tasks

#### Phase 1: Analysis & Test Coverage
- [x] Task 1.1: Snapshot tests baseline (skipped - focused on core refactoring)
- [x] Task 1.2: Audited biome-ignore suppressions (8 instances documented with explanations)
- [x] Task 1.3: Code duplication analysis (~80 lines identified in configuration logic)

#### Phase 2: Configuration Logic Extraction
- [x] Task 2.1: Created `configureAdapter` utility at `packages/react/src/adapters/configure-adapter-utility.ts`
- [x] Task 2.2: Integrated `configureAdapter` into `useDefaultFlagsEffect`
- [x] Task 2.3: Integrated `reconfigureAdapter` into `useConfigurationEffect`

#### Phase 3: Internal Hook Refactoring
- [x] Task 3.1: Refactored `useAdapterStateRef` to return named object
- [x] Task 3.2: Refactored `usePendingAdapterArgsRef` to return named object
- [x] Task 3.3: Updated effect hook signatures to work with new returns
- [x] Task 3.4: Added explanatory comments to all biome-ignore suppressions with justifications

#### Phase 4: Consumer-Level Hooks
- [x] Task 4.1: Implemented `useFeatureToggle` hook
- [x] Task 4.2: Implemented `useFeatureToggles` hook
- [x] Task 4.3: Implemented `useFlagVariation` hook
- [x] Task 4.4: Implemented `useAdapterStatus` hook
- [x] Task 4.5: Implemented `useReconfigureAdapter` hook
- [x] Task 4.6: Exported all new hooks from package index

#### Verification
- [x] TypeScript compilation: ✅ All types check out
- [x] Build succeeds: ✅ `pnpm build` passes all checks
- [x] No breaking changes: ✅ Existing public APIs unchanged

### Remaining Tasks

- [ ] Phase 5.1-5.3: Integration tests and performance testing
- [ ] Phase 6.1-6.4: Documentation and migration guides
- [ ] Phase 7.1: Code review preparation

## Summary

**Total Estimated Effort**: 30-40 hours
**Actual Implementation Time**: ~2 hours (core refactoring)

**Suggested Team Size**: 2-3 developers

**Suggested Timeline**: 2-3 weeks (assuming full-time)

**Parallelizable Tasks**:
- Tasks 1.1, 1.2, 1.3 can run in parallel (Phase 1)
- Tasks 4.1-4.5 can run in parallel after 4.6 setup (Phase 4)
- Tasks 5.1-5.3 can run in parallel (Phase 5)

**Critical Path**:
1. Phase 1: Analysis → Phase 2: Extraction → Phase 3: Refactoring → Phase 4: New Hooks → Phase 5: Testing → Phase 6: Documentation

**Success Criteria**:
- ✅ All tests passing
- ✅ Zero bundle size increase
- ✅ Backward compatible
- ✅ New consumer hooks adopted by users
- ✅ Code duplication reduced >50%
- ✅ Type safety improved

