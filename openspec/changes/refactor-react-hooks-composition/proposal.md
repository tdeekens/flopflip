# Proposal: Refactor React Hooks Composition Patterns

**Change ID**: `refactor-react-hooks-composition`

**Status**: Proposal

**Author**: Claude Code

**Date**: 2025-10-17

---

## Overview

This proposal refactors the hook composition patterns in `@flopflip/react` to improve code quality, maintainability, and API usability. The current implementation has sophisticated lifecycle management but suffers from code duplication, complex tuple returns, and high parameter counts in internal hooks.

**Goals**:
1. **Reduce code duplication** in adapter configuration logic
2. **Improve API clarity** by replacing tuple returns with named objects
3. **Enhance consumer experience** with better-typed, higher-level hooks
4. **Maintain backward compatibility** with existing public APIs
5. **Improve maintainability** through clearer separation of concerns

---

## Scope

### In Scope
- Refactor internal hook patterns in `@flopflip/react` (configure-adapter component)
- Simplify parameter passing in internal hooks
- Add new consumer-facing hooks with better APIs
- Extract shared adapter configuration logic
- Update type definitions for improved type safety

### Out of Scope
- Changes to adapter interface (`TAdapterInterface`)
- State management layer changes (Redux/broadcast)
- Changes to existing public component APIs (breaking changes)
- Provider-specific adapter implementations

---

## Current State Analysis

**Location**: `/packages/react/src/`

### Key Issues

1. **Code Duplication**: Adapter configuration logic repeated across `useDefaultFlagsEffect()` and `useConfigurationEffect()` (~40 lines duplicated)

2. **Tuple Returns**: Internal hooks return tuples with 3-4 positional values:
   ```typescript
   const [state, setter, getter1, getter2] = useAdapterStateRef();
   ```
   This reduces readability and increases error risk.

3. **Parameter Proliferation**: Internal effect hooks receive 8-12 parameters:
   ```typescript
   useConfigurationEffect({
     adapter, shouldDeferAdapterConfiguration,
     getDoesAdapterNeedInitialConfiguration, setAdapterState,
     onFlagsStateChange, onStatusStateChange, applyAdapterArgs,
     getAdapterArgsForConfiguration, getIsAdapterConfigured,
     pendingAdapterArgsRef, appliedAdapterArgs,
   })
   ```

4. **Limited Consumer Hooks**: Only 3 exported hooks, and 2 are simple context wrappers. Missing higher-level hooks like `useFeatureToggle()` and `useFeatureToggles()`.

5. **Implicit Dependencies**: Multiple `biome-ignore` linter suppressions (8+ instances) suggest dependency array complexity that could be addressed.

---

## Proposed Changes

### Change 1: Hook Composition Patterns (Internal API)

**File**: `openspec/changes/refactor-react-hooks-composition/specs/hook-composition/spec.md`

Refactor internal hook returns from tuples to named objects and extract configuration logic.

### Change 2: Consumer-Level Hooks (Public API)

**File**: `openspec/changes/refactor-react-hooks-composition/specs/consumer-hooks/spec.md`

Add higher-level consumer hooks for common use cases.

### Change 3: Configuration Logic Extraction

**File**: `openspec/changes/refactor-react-hooks-composition/specs/configuration-logic/spec.md`

Extract shared adapter configuration logic into a reusable utility.

---

## Implementation Approach

1. **Phase 1**: Extract configuration logic into shared utilities
2. **Phase 2**: Refactor internal hooks to use named object returns
3. **Phase 3**: Add new consumer-level hooks with improved APIs
4. **Phase 4**: Update tests and documentation
5. **Phase 5**: Add deprecation warnings for existing tuple-based internal APIs (if exported)

---

## Backward Compatibility

- **Public API**: Maintain full backward compatibility with existing hooks (`useAdapterContext`, `useAdapterReconfiguration`)
- **Internal API**: Internal hooks (prefixed with `use`) are not documented as public, so refactoring is low risk
- **Deprecation**: New consumer hooks will be recommended alternatives, but existing APIs will remain functional

---

## Success Criteria

- [ ] All tests pass (unit + integration)
- [ ] Code duplication reduced by >50%
- [ ] Type safety improved (no tuple indexing magic numbers)
- [ ] New consumer hooks have >95% type coverage
- [ ] Documentation updated with examples of new APIs
- [ ] Bundle size unchanged or reduced
- [ ] No performance regressions in benchmarks

---

## Related Capabilities

- Adapter lifecycle management (existing)
- Flag state management (existing)
- React Context integration (existing)

---

## Questions for Review

1. Should internal effect hooks be exported (with `_` prefix) for testing/reuse purposes?
2. Should we introduce a state machine library (e.g., `xstate`) for clearer lifecycle management, or keep internal implementation?
3. Are the 8 `biome-ignore` suppressions legitimate false positives, or do they indicate a deeper dependency issue?

