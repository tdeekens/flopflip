import warning from 'warning';
import isFeatureEnabled from './is-feature-enabled';

jest.mock('warning');

describe('with existing flag', () => {
  describe('with flag variation', () => {
    const args = { fooFlag: 'foo-variation' };

    it('should indicate feature being enabled', () => {
      expect(isFeatureEnabled('fooFlag', 'foo-variation')(args)).toBe(true);
    });

    it('should indicate feature being disabled', () => {
      expect(isFeatureEnabled('fooFlag', 'foo-variation-1')(args)).toBe(false);
    });
  });

  describe('without flag variation', () => {
    it('should indicate feature being enabled', () => {
      const args = { fooFlag: true };
      expect(isFeatureEnabled('fooFlag')(args)).toBe(true);
    });

    it('should indicate feature being disabled', () => {
      const args = { fooFlag: false };
      expect(isFeatureEnabled('fooFlag')(args)).toBe(false);
    });
  });
});

describe('with non normalized flag', () => {
  it('should indicate feature being disabled', () => {
    const args = { fooFlag: true };
    expect(isFeatureEnabled('foo-flag')(args)).toBe(false);
  });

  it('should invoke `warning`', () => {
    const args = { fooFlag: false };
    isFeatureEnabled('fooFlag')(args);

    expect(warning).toHaveBeenCalled();
  });
});

describe('with non existing flag', () => {
  it('should indicate feature being disabled', () => {
    const args = { fooFlag: true };
    expect(isFeatureEnabled('fooFlag2')(args)).toBe(false);
  });
});
