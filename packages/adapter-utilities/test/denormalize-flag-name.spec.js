import { describe, expect, it } from 'vitest';
import { denormalizeFlagName } from '../src/denormalize-flag-name';

describe('with camel case', () => {
  it('should camel case to uppercase flag names', () => {
    expect(denormalizeFlagName('aFlag')).toEqual('a-flag');
  });
});
