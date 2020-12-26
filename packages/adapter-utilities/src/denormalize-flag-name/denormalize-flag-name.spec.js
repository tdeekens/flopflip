import denormalizeFlagName from './denormalize-flag-name';

describe('with camel case', () => {
  it('should camel case to uppercased flag names', () => {
    expect(denormalizeFlagName('aFlag')).toEqual('a-flag');
  });
});
