import React from 'react';
import { shallow } from 'enzyme';
import wrapDisplayName from './wrap-display-name';

function BaseComponent() {
  return 'BaseComponent';
}
BaseComponent.displayName = 'BaseComponent';

describe('rendering', () => {
  const hocName = 'testHoc';
  let EnhancedComponent;
  let wrapper;

  beforeEach(() => {
    EnhancedComponent = wrapDisplayName(hocName)(BaseComponent);
  });

  it('should include `hocName` in wrapped display name', () => {
    expect(EnhancedComponent.displayName).toContain(hocName);
  });
});
