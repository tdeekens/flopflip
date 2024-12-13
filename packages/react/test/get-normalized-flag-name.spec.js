import { describe, expect, it } from 'vitest';
import { getNormalizedFlagName } from '../src/get-normalized-flag-name';

describe('when not camel caased', () => {
  it('should normalized the flag name', () => {
    expect(getNormalizedFlagName('foo-flag')).toEqual('fooFlag');
    expect(getNormalizedFlagName('foo_flag')).toEqual('fooFlag');
    expect(getNormalizedFlagName('foo flag')).toEqual('fooFlag');
  });
});

describe('when camel caased', () => {
  it('should normalized the flag name', () => {
    expect(getNormalizedFlagName('fooFlag')).toEqual('fooFlag');
  });
});
