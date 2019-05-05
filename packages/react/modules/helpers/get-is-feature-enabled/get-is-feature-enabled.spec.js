import warning from 'tiny-warning';
import getIsFeatureEnabled from './get-is-feature-enabled';

jest.mock('tiny-warning');

describe('with existing flag', () => {
  describe('with flag variation', () => {
    const args = { fooFlag: 'foo-variation' };

    it('should indicate feature being enabled', () => {
      expect(getIsFeatureEnabled('fooFlag', 'foo-variation')(args)).toBe(true);
    });

    it('should indicate feature being disabled', () => {
      expect(getIsFeatureEnabled('fooFlag', 'foo-variation-1')(args)).toBe(
        false
      );
    });
  });

  describe('without flag variation', () => {
    it('should indicate feature being enabled', () => {
      const args = { fooFlag: true };
      expect(getIsFeatureEnabled('fooFlag')(args)).toBe(true);
    });

    it('should indicate feature being disabled', () => {
      const args = { fooFlag: false };
      expect(getIsFeatureEnabled('fooFlag')(args)).toBe(false);
    });
  });
});

describe('with non normalized flag', () => {
  it('should indicate feature being disabled', () => {
    const args = { fooFlag: true };
    expect(getIsFeatureEnabled('foo-flag')(args)).toBe(false);
  });

  it('should invoke `warning`', () => {
    const args = { fooFlag: false };
    getIsFeatureEnabled('fooFlag')(args);

    expect(warning).toHaveBeenCalled();
  });
});

describe('with non existing flag', () => {
  it('should indicate feature being disabled', () => {
    const args = { fooFlag: true };
    expect(getIsFeatureEnabled('fooFlag2')(args)).toBe(false);
  });
});
