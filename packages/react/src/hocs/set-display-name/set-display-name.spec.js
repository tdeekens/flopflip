import setDisplayName from './set-display-name';
import { describe, it, expect } from 'vitest';

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
