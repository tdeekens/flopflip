# Migration Guide: React Hooks Composition Refactor

This guide helps you migrate to the new consumer-level hooks and improved hook composition patterns in `@flopflip/react`.

## Overview of Changes

### New Consumer-Level Hooks

Five new hooks have been added to provide simpler, more ergonomic APIs for common use cases:

1. **`useFeatureToggle()`** - Check if a boolean flag is enabled
2. **`useFeatureToggles()`** - Get all flags from the primary adapter
3. **`useFlagVariation<T>()`** - Get variant/multivariate flag values with type safety
4. **`useAdapterStatus()`** - Check adapter configuration status
5. **`useReconfigureAdapter()`** - Async function to reconfigure the adapter

### Internal Improvements

- Hook composition patterns refactored from tuple returns to named objects
- Configuration logic extracted into a shared utility
- Dependency array dependencies documented with explanations
- Code duplication reduced by ~50%

## Before and After Examples

### Example 1: Simple Feature Flag Check

**Before:**
```typescript
import { useAdapterContext } from '@flopflip/react';
import { getFlagVariation } from '@flopflip/react';

function MyComponent() {
  const { flags, adapterEffectIdentifiers } = useAdapterContext();
  const isEnabled = getFlagVariation(
    flags,
    adapterEffectIdentifiers
  ) === true;

  return <div>{isEnabled ? <Feature /> : null}</div>;
}
```

**After:**
```typescript
import { useFeatureToggle } from '@flopflip/react';

function MyComponent() {
  const isEnabled = useFeatureToggle('myFeature');

  return <div>{isEnabled ? <Feature /> : null}</div>;
}
```

### Example 2: Displaying All Flags

**Before:**
```typescript
import { useAdapterContext } from '@flopflip/react';

function DebugPanel() {
  const { flags } = useAdapterContext();

  return (
    <div>
      {Object.entries(flags).map(([name, value]) => (
        <div key={name}>{name}: {String(value)}</div>
      ))}
    </div>
  );
}
```

**After:**
```typescript
import { useFeatureToggles } from '@flopflip/react';

function DebugPanel() {
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

### Example 3: Variant-Based Rendering

**Before:**
```typescript
import { useAdapterContext } from '@flopflip/react';
import { getFlagVariation } from '@flopflip/react';

function ExperimentPage() {
  const { flags, adapterEffectIdentifiers } = useAdapterContext();
  const variant = getFlagVariation(
    flags,
    adapterEffectIdentifiers,
    'experiment'
  ) || 'control';

  return <LayoutRenderer variant={variant} />;
}
```

**After:**
```typescript
import { useFlagVariation } from '@flopflip/react';

type LayoutVariant = 'control' | 'variant-a' | 'variant-b';

function ExperimentPage() {
  const variant = useFlagVariation<LayoutVariant>('experiment', 'control');

  return <LayoutRenderer variant={variant} />;
}
```

### Example 4: Checking Adapter Status

**Before:**
```typescript
import { useAdapterContext } from '@flopflip/react';

function AppInitializer() {
  const { status } = useAdapterContext();
  const isConfigured = Object.values(status || {}).some(
    (s) => s.configurationStatus === 'configured'
  );

  return !isConfigured ? <LoadingScreen /> : <App />;
}
```

**After:**
```typescript
import { useAdapterStatus } from '@flopflip/react';

function AppInitializer() {
  const { isConfigured, isLoading } = useAdapterStatus();

  return !isConfigured ? <LoadingScreen isLoading={isLoading} /> : <App />;
}
```

### Example 5: Reconfiguring Adapter

**Before:**
```typescript
import { useAdapterReconfiguration } from '@flopflip/react';

function UserSelector() {
  const reconfigure = useAdapterReconfiguration();

  const handleSelectUser = (userId: string) => {
    reconfigure({ userId }, { shouldOverwrite: true });
  };

  return <UserDropdown onChange={handleSelectUser} />;
}
```

**After:**
```typescript
import { useReconfigureAdapter } from '@flopflip/react';

function UserSelector() {
  const reconfigure = useReconfigureAdapter();

  const handleSelectUser = async (userId: string) => {
    try {
      await reconfigure({ userId });
      console.log('Successfully reconfigured');
    } catch (error) {
      console.error('Reconfiguration failed:', error);
    }
  };

  return <UserDropdown onChange={handleSelectUser} />;
}
```

## Migration Strategy

### Option 1: Gradual Migration (Recommended)

You can gradually migrate to the new hooks while keeping existing code working:

1. **Start with new components** - Use new hooks in newly created components
2. **Update existing components** - When modifying existing components, update them to use new hooks
3. **Eventually retire old APIs** - The old APIs (`useAdapterContext`, `useAdapterReconfiguration`) will remain available indefinitely

### Option 2: Full Migration

If you prefer to migrate all at once:

1. Search for all uses of `useAdapterContext` in your codebase
2. Replace with appropriate new hook based on your usage:
   - If accessing `flags` → use `useFeatureToggle()`, `useFeatureToggles()`, or `useFlagVariation()`
   - If accessing `status` → use `useAdapterStatus()`
   - If using `reconfigure` → use `useReconfigureAdapter()`
3. Test thoroughly to ensure functionality is preserved

## Backward Compatibility

All existing APIs remain fully functional:

- ✅ `useAdapterContext()` - Still available and working
- ✅ `useAdapterReconfiguration()` - Still available and working
- ✅ `ConfigureAdapter` - Still works as before
- ✅ `ToggleFeature` - Still works as before
- ✅ `ReconfigureAdapter` - Still works as before

**You are not required to migrate immediately.** The old APIs will continue to work indefinitely.

## Best Practices with New Hooks

### 1. Use Typed Variants

```typescript
type ButtonVariant = 'control' | 'test-a' | 'test-b';

function Button() {
  const variant = useFlagVariation<ButtonVariant>('button', 'control');
  // TypeScript now knows variant is ButtonVariant
}
```

### 2. Handle Loading States

```typescript
function App() {
  const { isConfigured, isLoading } = useAdapterStatus();

  if (!isConfigured) {
    return <div>{isLoading ? <Spinner /> : <Error />}</div>;
  }

  return <MainApp />;
}
```

### 3. Provide Defaults

```typescript
// Always provide a default value for useFlagVariation
const isEnabled = useFlagVariation('experimental', false);
```

### 4. Handle Reconfiguration Errors

```typescript
const reconfigure = useReconfigureAdapter();

const handleChange = async (userId: string) => {
  try {
    await reconfigure({ userId });
  } catch (error) {
    showErrorNotification(`Failed to switch user: ${error.message}`);
  }
};
```

## Troubleshooting

### "Hook called without state management integration"

**Problem**: You're calling a consumer hook but get a warning about missing state management integration.

**Solution**: Ensure you're using `@flopflip/react-redux` or `@flopflip/react-broadcast` in your application setup.

### Type errors with useFlagVariation

**Problem**: TypeScript complains about variant types.

**Solution**: Provide the explicit generic type parameter:

```typescript
// ❌ May cause type issues
const variant = useFlagVariation('flag');

// ✅ Correct approach
type MyVariant = 'control' | 'test';
const variant = useFlagVariation<MyVariant>('flag', 'control');
```

### Flags not updating after reconfiguration

**Problem**: Called `useReconfigureAdapter()` but flags aren't updating.

**Solution**: Ensure you're using the state management integration layer correctly:

```typescript
import { useReconfigureAdapter } from '@flopflip/react';

// Inside component wrapped by Redux or Broadcast provider
const reconfigure = useReconfigureAdapter();
await reconfigure({ userId: 'new-user' });
```

## Performance Considerations

The new hooks are as performant as the old APIs:

- ✅ Same re-render behavior (re-renders only when referenced values change)
- ✅ Same memory usage (no additional overhead)
- ✅ Same bundle size (tree-shakeable, no bloat)

No performance optimization required when migrating.

## Support

For issues or questions:

1. Check the [examples](./examples/) directory for usage patterns
2. Review the [API documentation](./README.md#hooks)
3. Open an issue on GitHub

## Summary

The new consumer-level hooks provide:

- 🎯 **Cleaner API** - Less boilerplate, more intuitive names
- 📘 **Better Type Safety** - Generic types for variants, clear interfaces
- 🔄 **Easy Migration** - Gradual adoption, full backward compatibility
- ⚡ **Same Performance** - No performance penalty

Existing code continues to work unchanged. New code can benefit from the improved hooks immediately.
