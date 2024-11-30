import normalizeFlag from './normalize-flag';
import { describe, it, expect } from "vitest";


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
