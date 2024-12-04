import { describe, expect, it } from 'vitest';
import { normalizeFlag } from '../src/normalize-flag';

describe('with dashes', () => {
  it('should camel case to uppercase flag names', () => {
    expect(normalizeFlag('a-flag', 'false')).toEqual(['aFlag', 'false']);
  });
});

describe('with whitespace', () => {
  it('should camel case to uppercase flag names', () => {
    expect(normalizeFlag('a flag', 'false')).toEqual(['aFlag', 'false']);
  });
});
