# Spec: Configuration Logic Extraction

**Capability**: Centralized adapter configuration logic utility

**Scope**: Shared configuration logic across initialization and reconfiguration

---

## ADDED Requirements

### Requirement: configureAdapter Utility Function

The system MUST provide a utility function that centralizes adapter configuration logic, eliminating code duplication.

#### Scenario: Utility handles adapter initialization

```typescript
import { configureAdapter } from "@flopflip/react";

// In effect hooks (both initial and reconfiguration)
try {
  await configureAdapter(adapter, adapterArgs, {
    onFlagsStateChange: handleFlagsChange,
    onStatusStateChange: handleStatusChange,
  });
} catch (error) {
  // Handle configuration error
  console.error("Adapter configuration failed:", error);
}
```

**Expected Behavior**:
- Utility accepts adapter instance, configuration args, and callbacks
- Returns promise that resolves when configuration completes
- Rejects if configuration fails
- Handles both success and error cases uniformly
- Provides consistent logging/error handling
- Used by both initial and reconfiguration effects

**Constraints**:
- Utility is internal (not exported to consumers)
- Configuration is delegated to adapter.configure() (no business logic duplication)
- Error handling follows adapter contract

**Implementation Location**:
- File: `packages/react/src/adapters/configure-adapter-utility.ts`

**Test Case**:
```typescript
describe("configureAdapter utility", () => {
  it("should call adapter.configure with correct arguments", async () => {
    const mockAdapter = createMockAdapter();
    const callbacks = {
      onFlagsStateChange: vi.fn(),
      onStatusStateChange: vi.fn(),
    };

    await configureAdapter(mockAdapter, testArgs, callbacks);

    expect(mockAdapter.configure).toHaveBeenCalledWith(testArgs, callbacks);
  });

  it("should handle successful configuration", async () => {
    const mockAdapter = createMockAdapter();
    mockAdapter.configure.mockResolvedValue(undefined);

    const result = configureAdapter(mockAdapter, testArgs);

    await expect(result).resolves.toBeUndefined();
  });

  it("should handle configuration errors", async () => {
    const mockAdapter = createMockAdapter();
    const configError = new Error("Configuration failed");
    mockAdapter.configure.mockRejectedValue(configError);

    await expect(
      configureAdapter(mockAdapter, testArgs)
    ).rejects.toThrow("Configuration failed");
  });

  it("should invoke both success callbacks", async () => {
    const mockAdapter = createMockAdapter();
    const onFlagsStateChange = vi.fn();
    const onStatusStateChange = vi.fn();

    await configureAdapter(mockAdapter, testArgs, {
      onFlagsStateChange,
      onStatusStateChange,
    });

    expect(onFlagsStateChange).toHaveBeenCalled();
    expect(onStatusStateChange).toHaveBeenCalled();
  });

  it("should handle undefined callbacks gracefully", async () => {
    const mockAdapter = createMockAdapter();

    // Should not throw when callbacks are undefined
    await expect(configureAdapter(mockAdapter, testArgs, {})).resolves.not.toThrow();
  });

  it("should not invoke callbacks if configuration fails", async () => {
    const mockAdapter = createMockAdapter();
    mockAdapter.configure.mockRejectedValue(new Error("Failed"));

    const onFlagsStateChange = vi.fn();
    const onStatusStateChange = vi.fn();

    try {
      await configureAdapter(mockAdapter, testArgs, {
        onFlagsStateChange,
        onStatusStateChange,
      });
    } catch {
      // Expected to throw
    }

    // Callbacks should not be called if adapter.configure rejects
    expect(onFlagsStateChange).not.toHaveBeenCalled();
    expect(onStatusStateChange).not.toHaveBeenCalled();
  });

  it("should support timeout handling", async () => {
    const mockAdapter = createMockAdapter();
    // Adapter resolves very slowly
    mockAdapter.configure.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 10000))
    );

    // This should timeout if timeout logic is implemented
    const promise = configureAdapter(mockAdapter, testArgs);

    // Implementation may include timeout handling
    // Depends on design decision about timeout strategy
  });
});
```

**Type Definition**:
```typescript
export async function configureAdapter(
  adapter: TAdapterInterface,
  args: TAdapterArgs,
  callbacks?: {
    onFlagsStateChange?: TOnFlagsStateChange;
    onStatusStateChange?: TOnStatusStateChange;
  }
): Promise<void>;
```

---

### Requirement: Usage in Effect Hooks

Both `useDefaultFlagsEffect` and `useConfigurationEffect` MUST use the shared `configureAdapter` utility.

#### Scenario: useDefaultFlagsEffect uses shared utility

```typescript
// Before (duplicated logic)
const useDefaultFlagsEffect = ({
  adapter,
  defaultFlags,
  onFlagsStateChange,
  onStatusStateChange,
  setAdapterState,
  pendingAdapterArgsRef,
  getAdapterArgsForConfiguration,
}) => {
  useEffect(() => {
    // ... state setup ...

    if (getIsAdapterConfigured()) {
      // Config already done, skip
      return;
    }

    setAdapterState(AdapterStates.CONFIGURING);

    adapter.configure(getAdapterArgsForConfiguration(), {
      onFlagsStateChange,
      onStatusStateChange,
    })
      .then(() => {
        // ... handle success ...
      })
      .catch((error) => {
        // ... handle error ...
      });
  }, [/* deps */]);
};

// After (using shared utility)
const useDefaultFlagsEffect = ({
  adapter,
  defaultFlags,
  onFlagsStateChange,
  onStatusStateChange,
  setAdapterState,
  pendingAdapterArgsRef,
  getAdapterArgsForConfiguration,
}) => {
  useEffect(() => {
    // ... state setup ...

    if (getIsAdapterConfigured()) {
      // Config already done, skip
      return;
    }

    setAdapterState(AdapterStates.CONFIGURING);

    configureAdapter(adapter, getAdapterArgsForConfiguration(), {
      onFlagsStateChange,
      onStatusStateChange,
    })
      .then(() => {
        // ... handle success (simplified) ...
      })
      .catch((error) => {
        // ... handle error (simplified) ...
      });
  }, [/* deps */]);
};
```

**Expected Behavior**:
- Both effects use identical configuration call path
- Duplicated try/catch and error handling logic removed
- Same error handling semantics in both effects
- Maintenance changes only need to happen in one place

**Benefits**:
- Reduces code duplication by ~80 lines
- Single source of truth for configuration logic
- Easier to add logging/metrics/debugging
- Consistent error handling across codebase

**Test Case**:
```typescript
describe("Effects using configureAdapter utility", () => {
  it("should use configureAdapter in both effects", async () => {
    const mockConfigureAdapter = vi.spyOn(module, "configureAdapter");
    const mockAdapter = createMockAdapter();

    renderHook(
      () => {
        useDefaultFlagsEffect({/* params */});
        useConfigurationEffect({/* params */});
      },
      { wrapper: TestWrapper }
    );

    // Both effects should call configureAdapter
    expect(mockConfigureAdapter).toHaveBeenCalledTimes(2);
  });

  it("should pass same arguments to configureAdapter from both effects", async () => {
    const mockAdapter = createMockAdapter();
    const args = { userId: "test-user" };

    // Call both effects in sequence
    const { rerender } = renderHook(
      () => useDefaultFlagsEffect({ adapter: mockAdapter, ...otherParams }),
      { wrapper: TestWrapper }
    );

    // Then call configuration effect with same args
    renderHook(
      () => useConfigurationEffect({ adapter: mockAdapter, ...otherParams }),
      { wrapper: TestWrapper }
    );

    // Verify both calls were made with consistent args
    expect(mockAdapter.configure).toHaveBeenCalledWith(args, expect.any(Object));
  });

  it("should handle errors consistently in both effects", async () => {
    const mockAdapter = createMockAdapter();
    const error = new Error("Configuration failed");
    mockAdapter.configure.mockRejectedValue(error);

    const errorHandler1 = vi.fn();
    const errorHandler2 = vi.fn();

    renderHook(
      () => {
        try {
          useDefaultFlagsEffect({
            adapter: mockAdapter,
            onErrorOccurred: errorHandler1,
          });
        } catch (e) {
          errorHandler1(e);
        }
      },
      { wrapper: TestWrapper }
    );

    // Both effects should handle the same error the same way
    expect(errorHandler1).toHaveBeenCalledWith(error);
  });
});
```

---

## MODIFIED Requirements

### Requirement: Error Handling Consistency

Error handling MUST be consistent across all configuration calls using `configureAdapter`.

#### Before: Inconsistent error handling
```typescript
// useDefaultFlagsEffect error handling
.catch((error) => {
  setAdapterState(AdapterStates.UNCONFIGURED);
  if (onStatusStateChange) {
    onStatusStateChange({ status: "error" });
  }
});

// useConfigurationEffect error handling (slightly different)
.catch((error) => {
  // Different logic
  console.error("Configuration error:", error);
  setAdapterState(AdapterStates.UNCONFIGURED);
  // onStatusStateChange not called in same way
});
```

#### After: Consistent error handling
```typescript
// Both effects use same error path
.catch((error) => {
  setAdapterState(AdapterStates.UNCONFIGURED);
  if (onStatusStateChange) {
    onStatusStateChange({
      status: "error",
      reason: error.message,
    });
  }
  // Consistent logging
  console.error("Adapter configuration failed:", error);
});
```

**Expected Behavior**:
- All configuration errors follow same code path
- Error state is consistently set to UNCONFIGURED
- Status callbacks are called with consistent error information
- Logging/monitoring is applied uniformly

**Test Case**:
```typescript
describe("Configuration error handling", () => {
  it("should set adapter state to UNCONFIGURED on error", async () => {
    const mockAdapter = createMockAdapter();
    mockAdapter.configure.mockRejectedValue(new Error("Failed"));

    const { setAdapterState } = useAdapterStateRef();
    const setAdapterStateSpy = vi.spyOn({ setAdapterState }, "setAdapterState");

    try {
      await configureAdapter(mockAdapter, testArgs);
    } catch {
      // Expected
    }

    // Verify state is reset to UNCONFIGURED
    expect(setAdapterStateSpy).toHaveBeenCalledWith(AdapterStates.UNCONFIGURED);
  });

  it("should call onStatusStateChange with error status", async () => {
    const mockAdapter = createMockAdapter();
    mockAdapter.configure.mockRejectedValue(new Error("Network error"));
    const onStatusStateChange = vi.fn();

    try {
      await configureAdapter(mockAdapter, testArgs, { onStatusStateChange });
    } catch {
      // Expected
    }

    expect(onStatusStateChange).toHaveBeenCalledWith(
      expect.objectContaining({ status: "error" })
    );
  });
});
```

---

## Spec References

- Related: Internal Hook Composition Specification
- Depends on: TAdapterInterface contract
- Impacts: ConfigureAdapter component implementation

