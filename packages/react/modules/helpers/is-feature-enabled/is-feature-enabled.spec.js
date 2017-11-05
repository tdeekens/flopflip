import isFeatureEnabled from './is-feature-enabled';

describe('with existing flag', () => {
  describe('with flag variate', () => {
    const props = { fooFlag: 'foo-variate' };

    it('should indicate feature being enabled', () => {
      expect(isFeatureEnabled('fooFlag', 'foo-variate')(props)).toBe(true);
    });

    it('should indicate feature being disabled', () => {
      expect(isFeatureEnabled('fooFlag', 'foo-variate-1')(props)).toBe(false);
    });
  });

  describe('without flag variate', () => {
    it('should indicate feature being enabled', () => {
      const props = { fooFlag: true };
      expect(isFeatureEnabled('fooFlag')(props)).toBe(true);
    });

    it('should indicate feature being disabled', () => {
      const props = { fooFlag: false };
      expect(isFeatureEnabled('fooFlag')(props)).toBe(false);
    });
  });
});

describe('with non existing flag', () => {
  it('should indicate feature being disabled', () => {
    const props = { fooFlag: true };
    expect(isFeatureEnabled('fooFlag2')(props)).toBe(false);
  });
});
