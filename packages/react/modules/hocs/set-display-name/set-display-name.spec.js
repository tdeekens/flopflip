import React from 'react';
import { shallow } from 'enzyme';
import setDisplayName from './set-display-name';

function BaseComponent() {
  return 'BaseComponent';
}
BaseComponent.displayName = 'BaseComponent';

describe('rendering', () => {
  const nextDisplayName = 'RenamedBaseComponent';
  let EnhancedComponent;
  let wrapper;

  beforeEach(() => {
    EnhancedComponent = setDisplayName(nextDisplayName)(BaseComponent);
  });

  it('should overwrite the previous display name', () => {
    expect(EnhancedComponent.displayName).toEqual(nextDisplayName);
  });
});
