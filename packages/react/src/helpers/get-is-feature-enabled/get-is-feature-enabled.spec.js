import getIsFeatureEnabled from './get-is-feature-enabled';

jest.mock('tiny-warning');

describe('with existing flag', () => {
  describe('with flag variation', () => {
    const flags = { memory: { fooFlag: 'foo-variation' } };
    const adapterIdentifiers = ['memory'];

    it('should indicate feature being enabled', () => {
      expect(
        getIsFeatureEnabled(
          adapterIdentifiers,
          'fooFlag',
          'foo-variation'
        )(flags)
      ).toBe(true);
    });

    it('should indicate feature being disabled', () => {
      expect(
        getIsFeatureEnabled(
          adapterIdentifiers,
          'fooFlag',
          'foo-variation-1'
        )(flags)
      ).toBe(false);
    });
  });

  describe('without flag variation', () => {
    it('should indicate feature being enabled', () => {
      const flags = { memory: { fooFlag: true } };
      const adapterIdentifiers = ['memory'];

      expect(getIsFeatureEnabled(adapterIdentifiers, 'fooFlag')(flags)).toBe(
        true
      );
    });

    it('should indicate feature being disabled', () => {
      const flags = { memory: { fooFlag: false } };
      const adapterIdentifiers = ['memory'];

      expect(getIsFeatureEnabled(adapterIdentifiers, 'fooFlag')(flags)).toBe(
        false
      );
    });
  });
});

describe('with non existing flag', () => {
  it('should indicate feature being disabled', () => {
    const flags = { memory: { fooFlag: true } };
    const adapterIdentifiers = ['memory'];

    expect(getIsFeatureEnabled(adapterIdentifiers, 'fooFlag2')(flags)).toBe(
      false
    );
  });
});
