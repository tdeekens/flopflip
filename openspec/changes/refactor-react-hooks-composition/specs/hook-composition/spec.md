# Spec: Internal Hook Composition Patterns

**Capability**: Hook composition patterns in `@flopflip/react`

**Scope**: Internal hooks and their return types

---

## ADDED Requirements

### Requirement: Named Object Return Types for Internal Hooks

Internal hooks MUST return named objects instead of tuples to improve type safety and readability.

#### Scenario: useAdapterStateRef hook returns named object

```typescript
// New API
const { adapterStateRef, setAdapterState, getIsAdapterConfigured, getDoesAdapterNeedInitialConfiguration } = useAdapterStateRef();

// Usage
if (getIsAdapterConfigured()) {
  // Handle configured state
}

adapterStateRef.current = AdapterStates.CONFIGURING;
```

**Expected Behavior**:
- Hook returns object with named properties
- Each property has clear semantic meaning
- No positional index dependencies
- Full TypeScript type support with intellisense

**Test Case**:
```typescript
describe("useAdapterStateRef", () => {
  it("should return named object with state accessors", () => {
    const { result } = renderHook(() => useAdapterStateRef());

    expect(result.current).toHaveProperty("adapterStateRef");
    expect(result.current).toHaveProperty("setAdapterState");
    expect(result.current).toHaveProperty("getIsAdapterConfigured");
    expect(result.current).toHaveProperty("getDoesAdapterNeedInitialConfiguration");
  });

  it("should allow state updates via setAdapterState", () => {
    const { result } = renderHook(() => useAdapterStateRef());

    act(() => {
      result.current.setAdapterState(AdapterStates.CONFIGURING);
    });

    expect(result.current.getIsAdapterConfigured()).toBe(false);
  });
});
```

---

### Requirement: Extract Adapter Configuration Logic

Shared adapter configuration logic MUST be extracted into a reusable utility function.

#### Scenario: configureAdapter utility handles adapter initialization

```typescript
// New utility function
async function configureAdapter(
  adapter: TAdapterInterface,
  adapterArgs: TAdapterArgs,
  callbacks?: {
    onFlagsStateChange?: TOnFlagsStateChange;
    onStatusStateChange?: TOnStatusStateChange;
  }
): Promise<void> {
  // Centralized configuration logic
  return adapter.configure(adapterArgs, callbacks)
    .then(() => {
      // Handle success
    })
    .catch((error) => {
      // Handle error
    });
}

// Usage in effects
await configureAdapter(adapter, adapterArgs, { onFlagsStateChange, onStatusStateChange });
```

**Expected Behavior**:
- Utility abstracts configuration complexity
- Same code path used by both initial and reconfiguration effects
- Proper error handling and logging
- Type-safe callback parameters

**Test Case**:
```typescript
describe("configureAdapter", () => {
  it("should call adapter.configure with correct args and callbacks", async () => {
    const adapter = mockAdapter();
    const callbacks = { onFlagsStateChange: vi.fn(), onStatusStateChange: vi.fn() };

    await configureAdapter(adapter, testArgs, callbacks);

    expect(adapter.configure).toHaveBeenCalledWith(testArgs, callbacks);
  });

  it("should handle adapter.configure errors gracefully", async () => {
    const adapter = mockAdapter();
    adapter.configure.mockRejectedValue(new Error("Config failed"));

    expect(() => configureAdapter(adapter, testArgs)).rejects.toThrow("Config failed");
  });
});
```

---

### Requirement: Parameter Grouping in Internal Effect Hooks

Internal effect hooks MUST receive grouped parameters organized by concern.

#### Scenario: useConfigurationEffect receives grouped parameters

```typescript
// New signature with grouped parameters
useConfigurationEffect({
  // Core adapter instance
  adapter: TAdapterInterface,

  // State accessors from useAdapterStateRef
  state: {
    adapterStateRef: React.MutableRefObject<TAdapterStates>;
    setAdapterState: (state: TAdapterStates) => void;
    getIsAdapterConfigured: () => boolean;
    getDoesAdapterNeedInitialConfiguration: () => boolean;
  },

  // Callbacks for state updates
  callbacks: {
    onFlagsStateChange?: TOnFlagsStateChange;
    onStatusStateChange?: TOnStatusStateChange;
  },

  // Adapter args management
  args: {
    getAdapterArgsForConfiguration: () => TAdapterArgs;
    applyAdapterArgs: (args: TAdapterArgs) => void;
    pendingAdapterArgsRef: React.MutableRefObject<TAdapterArgs | undefined>;
    appliedAdapterArgs: TAdapterArgs;
  },

  // Configuration options
  config: {
    shouldDeferAdapterConfiguration?: boolean;
  },
}): void
```

**Expected Behavior**:
- Hook receives all dependencies in clearly organized object
- Parameter count reduced from 11 to 5 logical groups
- IDE autocomplete shows available parameters
- Self-documenting code through grouping

**Test Case**:
```typescript
describe("useConfigurationEffect parameter grouping", () => {
  it("should accept grouped parameters correctly", () => {
    const params = {
      adapter: mockAdapter(),
      state: mockStateObject(),
      callbacks: { onFlagsStateChange: vi.fn() },
      args: mockArgsObject(),
      config: { shouldDeferAdapterConfiguration: false },
    };

    renderHook(() => useConfigurationEffect(params));

    expect(mockAdapter().configure).toHaveBeenCalled();
  });
});
```

---

## MODIFIED Requirements

### Requirement: usePendingAdapterArgsRef Return Type

The return type of `usePendingAdapterArgsRef` MUST be refactored to use named object.

#### Before (tuple)
```typescript
const [pendingAdapterArgsRef, setPendingAdapterArgs, getAdapterArgsForConfiguration] = usePendingAdapterArgsRef();
```

#### After (named object)
```typescript
const { pendingAdapterArgsRef, setPendingAdapterArgs, getAdapterArgsForConfiguration } = usePendingAdapterArgsRef();

// Clear semantics
if (pendingAdapterArgsRef.current !== undefined) {
  // Pending reconfiguration exists
}
```

**Expected Behavior**:
- All existing functionality preserved
- Same behavior but with improved API
- No breaking changes to component consumers

**Test Case**:
```typescript
describe("usePendingAdapterArgsRef refactored return", () => {
  it("should return named object with args management methods", () => {
    const { result } = renderHook(() => usePendingAdapterArgsRef());

    expect(result.current).toHaveProperty("pendingAdapterArgsRef");
    expect(result.current).toHaveProperty("setPendingAdapterArgs");
    expect(result.current).toHaveProperty("getAdapterArgsForConfiguration");
  });

  it("should maintain existing functionality after refactoring", () => {
    const { result } = renderHook(() => usePendingAdapterArgsRef());

    act(() => {
      result.current.setPendingAdapterArgs({ userId: "test-user" });
    });

    expect(result.current.getAdapterArgsForConfiguration()).toEqual({ userId: "test-user" });
  });
});
```

---

### Requirement: Dependency Array Documentation

All `biome-ignore` suppressions MUST be reviewed and documented.

#### Scenario: Justified dependency array suppression

```typescript
// Before (no explanation)
// biome-ignore lint/correctness/useExhaustiveDependencies
const setAdapterState = useCallback(..., []);

// After (with explanation)
// We intentionally omit dependencies here because:
// 1. Ref-based state ensures identity stability
// 2. Including dependencies would cause infinite loops
// 3. This is safe because setAdapterState is only used within this component
// biome-ignore lint/correctness/useExhaustiveDependencies: justified - see comment above
const setAdapterState = useCallback(..., []);
```

**Expected Behavior**:
- Every suppression has explanatory comment
- Comments explain why suppression is safe/necessary
- Future maintainers understand the reasoning
- Code reviewers can verify justification

**Test Case**:
```typescript
// Linter verification - ensure no suppressions without comments
describe("Dependency array documentation", () => {
  it("should have explanatory comments for all biome-ignore suppressions", async () => {
    const source = await readFile("src/configure-adapter/configure-adapter.tsx");
    const suppressions = source.match(/biome-ignore.*useExhaustiveDependencies/g) || [];

    for (const suppression of suppressions) {
      expect(source).toContain(`// ${suppression}`);
      // Verify comment precedes the suppression
    }
  });
});
```

---

## Spec References

- Related: Consumer Hooks Specification
- Related: Configuration Logic Extraction Specification
- Depends on: Existing @flopflip/react types and adapter interface

