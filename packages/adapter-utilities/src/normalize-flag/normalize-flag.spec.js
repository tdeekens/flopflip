import normalizeFlag from './normalize-flag';

describe('with dashes', () => {
  it('should camel case to uppercased flag names', () => {
    expect(normalizeFlag('a-flag', 'false')).toEqual(['aFlag', 'false']);
  });
});

describe('with whitespace', () => {
  it('should camel case to uppercased flag names', () => {
    expect(normalizeFlag('a flag', 'false')).toEqual(['aFlag', 'false']);
  });
});
