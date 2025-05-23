import { describe, expect, it } from 'vitest';
import { wrapDisplayName } from '../src/wrap-display-name';

function BaseComponent() {
  return 'BaseComponent';
}

BaseComponent.displayName = 'BaseComponent';

describe('rendering', () => {
  const hocName = 'testHoc';

  it('should include `hocName` in wrapped display name', () => {
    const wrappedDisplayName = wrapDisplayName(BaseComponent, hocName);

    expect(wrappedDisplayName).toContain(hocName);
  });
});
