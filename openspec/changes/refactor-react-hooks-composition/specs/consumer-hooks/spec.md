# Spec: Consumer-Level Hooks

**Capability**: High-level consumer hooks for simplified API access

**Scope**: New public hooks exported from `@flopflip/react`

---

## ADDED Requirements

### Requirement: useFeatureToggle Hook for Boolean Flags

The system MUST provide a hook for simple boolean feature flag evaluation with clear, concise API.

#### Scenario: Component checks if feature is enabled

```typescript
import { useFeatureToggle } from "@flopflip/react";

function FeatureComponent() {
  const isNewDashboardEnabled = useFeatureToggle("newDashboard");

  if (isNewDashboardEnabled) {
    return <NewDashboard />;
  }
  return <LegacyDashboard />;
}
```

**Expected Behavior**:
- Hook accepts flag name as string
- Returns boolean (true if flag enabled, false otherwise)
- Automatically normalizes flag name (camelCase conversion)
- Accesses flag from primary adapter (first in list)
- Returns false if adapter not configured or flag not found
- Subscribes to adapter updates and re-renders on flag changes

**Constraints**:
- Flag name is case-insensitive (normalized to camelCase)
- Works only with boolean evaluation (variants return false)
- Returns stable boolean value (true/false only)

**Test Case**:
```typescript
describe("useFeatureToggle", () => {
  it("should return true when flag is enabled", () => {
    const wrapper = createWrapper({
      flagValues: { newDashboard: true },
    });
    const { result } = renderHook(() => useFeatureToggle("newDashboard"), { wrapper });

    expect(result.current).toBe(true);
  });

  it("should return false when flag is disabled", () => {
    const wrapper = createWrapper({
      flagValues: { newDashboard: false },
    });
    const { result } = renderHook(() => useFeatureToggle("newDashboard"), { wrapper });

    expect(result.current).toBe(false);
  });

  it("should handle variants as false", () => {
    const wrapper = createWrapper({
      flagValues: { experiment: "variant-b" },
    });
    const { result } = renderHook(() => useFeatureToggle("experiment"), { wrapper });

    expect(result.current).toBe(false);
  });

  it("should re-render when flag value changes", async () => {
    const wrapper = createWrapper({
      flagValues: { newDashboard: false },
    });
    const { result, rerender } = renderHook(() => useFeatureToggle("newDashboard"), { wrapper });

    expect(result.current).toBe(false);

    act(() => {
      updateFlags({ newDashboard: true });
    });

    expect(result.current).toBe(true);
  });
});
```

**Type Definition**:
```typescript
export function useFeatureToggle(flagName: string): boolean;
```

---

### Requirement: useFeatureToggles Hook for All Flags

The system MUST provide a hook for accessing all feature flags from the primary adapter.

#### Scenario: Component displays all active flags

```typescript
import { useFeatureToggles } from "@flopflip/react";

function FlagsDebugPanel() {
  const flags = useFeatureToggles();

  return (
    <div>
      {Object.entries(flags).map(([name, value]) => (
        <div key={name}>{name}: {String(value)}</div>
      ))}
    </div>
  );
}
```

**Expected Behavior**:
- Hook returns all flags object from primary adapter
- Object keys are flag names as provided by adapter
- Object values are flag values (boolean or string/variant)
- Returns empty object if adapter not configured
- Re-renders when any flag value changes

**Constraints**:
- Returns flags from primary adapter only (not merged across adapters)
- Returns object reference that changes when flags change (triggers re-render)
- No filtering or transformation of flag values

**Test Case**:
```typescript
describe("useFeatureToggles", () => {
  it("should return all flags object from adapter", () => {
    const flagValues = { feature1: true, feature2: false, experiment: "variant-a" };
    const wrapper = createWrapper({ flagValues });
    const { result } = renderHook(() => useFeatureToggles(), { wrapper });

    expect(result.current).toEqual(flagValues);
  });

  it("should return empty object if adapter not configured", () => {
    const wrapper = createWrapper({ isConfigured: false });
    const { result } = renderHook(() => useFeatureToggles(), { wrapper });

    expect(result.current).toEqual({});
  });

  it("should re-render when flags change", () => {
    const wrapper = createWrapper({
      flagValues: { feature1: true },
    });
    const { result } = renderHook(() => useFeatureToggles(), { wrapper });

    expect(result.current).toEqual({ feature1: true });

    act(() => {
      updateFlags({ feature1: false, feature2: true });
    });

    expect(result.current).toEqual({ feature1: false, feature2: true });
  });
});
```

**Type Definition**:
```typescript
export function useFeatureToggles(): TFlags;
```

---

### Requirement: useFlagVariation Hook for Multivariate Flags

The system MUST provide a hook for accessing variant/multivariate flag values with type safety.

#### Scenario: Component renders based on variant

```typescript
import { useFlagVariation } from "@flopflip/react";

type LayoutVariant = "control" | "variant-a" | "variant-b";

function ExperimentPage() {
  const variant = useFlagVariation<LayoutVariant>("layoutExperiment", "control");

  return <LayoutRenderer variant={variant} />;
}
```

**Expected Behavior**:
- Hook accepts flag name and optional default value
- Returns flag value or default if not found
- Generic type parameter allows type-safe variant discrimination
- Automatically normalizes flag name
- Returns default if adapter not configured
- Re-renders when flag value changes

**Constraints**:
- Default value is used if flag name not in adapter
- Generic type parameter is for type safety only (runtime is untyped)
- Works with both boolean and string/variant values

**Test Case**:
```typescript
describe("useFlagVariation", () => {
  it("should return flag value when flag exists", () => {
    const wrapper = createWrapper({
      flagValues: { experiment: "variant-b" },
    });
    const { result } = renderHook(
      () => useFlagVariation<string>("experiment", "control"),
      { wrapper }
    );

    expect(result.current).toBe("variant-b");
  });

  it("should return default value when flag not found", () => {
    const wrapper = createWrapper({
      flagValues: { feature1: true },
    });
    const { result } = renderHook(
      () => useFlagVariation("unknownFlag", "default"),
      { wrapper }
    );

    expect(result.current).toBe("default");
  });

  it("should support boolean flags", () => {
    const wrapper = createWrapper({
      flagValues: { betaFeature: true },
    });
    const { result } = renderHook(
      () => useFlagVariation<boolean>("betaFeature", false),
      { wrapper }
    );

    expect(result.current).toBe(true);
  });

  it("should support generic type parameter for variants", () => {
    type Variant = "control" | "experimental";
    const wrapper = createWrapper({
      flagValues: { experiment: "experimental" },
    });
    const { result } = renderHook(
      () => useFlagVariation<Variant>("experiment", "control"),
      { wrapper }
    );

    // TypeScript ensures variant is "control" | "experimental"
    expectType<Variant>(result.current);
    expect(result.current).toBe("experimental");
  });
});
```

**Type Definition**:
```typescript
export function useFlagVariation<T = any>(
  flagName: string,
  defaultValue?: T
): T;
```

---

### Requirement: useAdapterStatus Hook for Configuration State

The system MUST provide a hook for accessing adapter configuration and loading status.

#### Scenario: Component waits for adapter configuration

```typescript
import { useAdapterStatus } from "@flopflip/react";

function AppInitializer() {
  const { isConfigured, isLoading } = useAdapterStatus();

  if (!isConfigured) {
    return <LoadingScreen isLoading={isLoading} />;
  }

  return <MainApp />;
}
```

**Expected Behavior**:
- Hook returns object with status information
- `isConfigured`: true when adapter is fully configured
- `isLoading`: true when configuration is in progress
- `error`: optional error if configuration failed
- Updates when adapter status changes
- Provides information from primary adapter

**Constraints**:
- Status is boolean only (no string states for simplicity)
- Error object is optional (may be undefined)

**Test Case**:
```typescript
describe("useAdapterStatus", () => {
  it("should return isConfigured false when adapter not configured", () => {
    const wrapper = createWrapper({ adapterState: "UNCONFIGURED" });
    const { result } = renderHook(() => useAdapterStatus(), { wrapper });

    expect(result.current).toEqual({ isConfigured: false, isLoading: false });
  });

  it("should return isLoading true when configuration in progress", () => {
    const wrapper = createWrapper({ adapterState: "CONFIGURING" });
    const { result } = renderHook(() => useAdapterStatus(), { wrapper });

    expect(result.current).toEqual({ isConfigured: false, isLoading: true });
  });

  it("should return isConfigured true when fully configured", () => {
    const wrapper = createWrapper({ adapterState: "CONFIGURED" });
    const { result } = renderHook(() => useAdapterStatus(), { wrapper });

    expect(result.current).toEqual({ isConfigured: true, isLoading: false });
  });

  it("should update when adapter state changes", () => {
    const wrapper = createWrapper({ adapterState: "UNCONFIGURED" });
    const { result } = renderHook(() => useAdapterStatus(), { wrapper });

    expect(result.current.isConfigured).toBe(false);

    act(() => {
      setAdapterState("CONFIGURED");
    });

    expect(result.current.isConfigured).toBe(true);
  });
});
```

**Type Definition**:
```typescript
export interface TAdapterStatusResult {
  isConfigured: boolean;
  isLoading: boolean;
  error?: Error;
}

export function useAdapterStatus(): TAdapterStatusResult;
```

---

### Requirement: useReconfigureAdapter Hook for Adapter Reconfiguration

The system MUST provide a hook for reconfiguring adapter with error handling and type safety.

#### Scenario: Component updates user context

```typescript
import { useReconfigureAdapter } from "@flopflip/react";

function UserContextUpdater() {
  const reconfigure = useReconfigureAdapter();

  const handleUserChange = async (userId: string) => {
    try {
      await reconfigure({ userId, email: getUserEmail(userId) });
    } catch (error) {
      console.error("Reconfiguration failed:", error);
    }
  };

  return <UserSelector onChange={handleUserChange} />;
}
```

**Expected Behavior**:
- Hook returns async function that accepts adapter args
- Function reconfigures adapter with new args
- Function returns promise that resolves when reconfiguration complete
- Rejects if reconfiguration fails
- Typed with adapter-specific args type
- Handles queueing if reconfiguration in progress

**Constraints**:
- Must be called from component within ConfigureAdapter context
- Throws error if adapter not initialized
- Error handling is caller's responsibility

**Test Case**:
```typescript
describe("useReconfigureAdapter", () => {
  it("should return async reconfiguration function", () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useReconfigureAdapter(), { wrapper });

    expect(typeof result.current).toBe("function");
  });

  it("should reconfigure adapter with provided args", async () => {
    const mockAdapter = createMockAdapter();
    const wrapper = createWrapper({ adapter: mockAdapter });
    const { result } = renderHook(() => useReconfigureAdapter(), { wrapper });

    await act(async () => {
      await result.current({ userId: "new-user" });
    });

    expect(mockAdapter.reconfigure).toHaveBeenCalledWith({ userId: "new-user" });
  });

  it("should reject on reconfiguration error", async () => {
    const mockAdapter = createMockAdapter();
    mockAdapter.reconfigure.mockRejectedValue(new Error("Reconfiguration failed"));
    const wrapper = createWrapper({ adapter: mockAdapter });
    const { result } = renderHook(() => useReconfigureAdapter(), { wrapper });

    await expect(
      act(async () => {
        await result.current({ userId: "new-user" });
      })
    ).rejects.toThrow("Reconfiguration failed");
  });
});
```

**Type Definition**:
```typescript
export function useReconfigureAdapter(): (
  args: TAdapterArgs
) => Promise<void>;
```

---

## Spec References

- Related: Internal Hook Composition Specification
- Depends on: Existing @flopflip/react context and adapter interface
- Impacts: Public API surface, user documentation

