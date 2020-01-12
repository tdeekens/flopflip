import isNil from './is-nil';

describe('when null', () => {
  it('should indicate that the value is nil', () => {
    expect(isNil(null)).toBe(true);
  });
});

describe('when undefined', () => {
  it('should indicate that the value is nil', () => {
    expect(isNil(undefined)).toBe(true);
  });
});

describe('when anything else', () => {
  it('should indicate that the value is not nil', () => {
    expect(isNil('foo')).toBe(false);
  });
});
