import React from 'react';
import { shallow } from 'enzyme';
import wrapDisplayName from './wrap-display-name';

function BaseComponent() {
  return 'BaseComponent';
}
BaseComponent.displayName = 'BaseComponent';

describe('rendering', () => {
  const hocName = 'testHoc';
  let wrappedDisplayName;
  let wrapper;

  beforeEach(() => {
    wrappedDisplayName = wrapDisplayName(BaseComponent, hocName);
  });

  it('should include `hocName` in wrapped display name', () => {
    expect(wrappedDisplayName).toContain(hocName);
  });
});
