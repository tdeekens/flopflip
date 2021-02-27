import normalizeFlag from '../normalize-flag';
import normalizeFlags from './normalize-flags';

const rawFlags = {
  'a-flag': true,
  'flag-b-c': false,
};

describe('with default normalization', () => {
  describe('with dashes', () => {
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
});

describe('with custom normalization', () => {
  it('should use the custom normalization function', () => {
    const customNormalizeFlag = jest.fn((...args) => normalizeFlag(...args));

    expect(normalizeFlags(rawFlags, customNormalizeFlag)).toEqual({
      aFlag: true,
      flagBC: false,
    });
    expect(customNormalizeFlag).toHaveBeenCalled();
  });
});
