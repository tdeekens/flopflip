import warning from 'tiny-warning';
import getFlagVariation from './get-flag-variation';

jest.mock('tiny-warning');

describe('with existing flag variation', () => {
  describe('with flag variation', () => {
    const args = { fooFlag: 'foo-variation' };

    it('should return the flag variation', () => {
      expect(getFlagVariation('fooFlag')(args)).toBe('foo-variation');
    });
  });
});

describe('with non normalized flag variation', () => {
  it('should return the flag variation', () => {
    const args = { fooFlag: true };
    expect(getFlagVariation('foo-flag')(args)).toBe(true);
  });

  it('should invoke `warning`', () => {
    const args = { fooFlag: false };
    getFlagVariation('fooFlag')(args);

    expect(warning).toHaveBeenCalled();
  });
});

describe('with non existing flag variation', () => {
  it('should indicate flag variation not existing', () => {
    const args = { fooFlag: true };
    expect(getFlagVariation('fooFlag2')(args)).toBe(false);
  });
});
