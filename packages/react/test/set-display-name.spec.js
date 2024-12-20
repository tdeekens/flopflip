import { describe, expect, it } from 'vitest';
import { setDisplayName } from '../src/set-display-name';

function BaseComponent() {
  return 'BaseComponent';
}

BaseComponent.displayName = 'BaseComponent';

describe('rendering', () => {
  const nextDisplayName = 'RenamedBaseComponent';

  it('should overwrite the previous display name', () => {
    const EnhancedComponent = setDisplayName(nextDisplayName)(BaseComponent);

    expect(EnhancedComponent.displayName).toEqual(nextDisplayName);
  });
});
