import normalizeFlags from './normalize-flags';

describe('with dashes', () => {
  const rawFlags = {
    'a-flag': true,
    'flag-b-c': false,
  };

  it('should camel case to uppercased flag names', () => {
    expect(normalizeFlags(rawFlags)).toEqual({ aFlag: true, flagBC: false });
  });
});

describe('with spaces', () => {
  const rawFlags = {
    'a flag': true,
    'flag b-c': false,
  };

  it('should camel case to uppercased flag names', () => {
    expect(normalizeFlags(rawFlags)).toEqual({ aFlag: true, flagBC: false });
  });
});
