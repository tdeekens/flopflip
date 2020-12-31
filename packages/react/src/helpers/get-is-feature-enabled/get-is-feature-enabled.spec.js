import getIsFeatureEnabled from './get-is-feature-enabled';

jest.mock('tiny-warning');

describe('with existing flag', () => {
  describe('with flag variation', () => {
    const allFlags = { memory: { fooFlag: 'foo-variation' } };
    const adapterIdentifiers = ['memory'];

    it('should indicate feature being enabled', () => {
      expect(
        getIsFeatureEnabled(
          allFlags,
          adapterIdentifiers,
          'fooFlag',
          'foo-variation'
        )
      ).toBe(true);
    });

    it('should indicate feature being disabled', () => {
      expect(
        getIsFeatureEnabled(
          allFlags,
          adapterIdentifiers,
          'fooFlag',
          'foo-variation-1'
        )
      ).toBe(false);
    });
  });

  describe('without flag variation', () => {
    it('should indicate feature being enabled', () => {
      const allFlags = { memory: { fooFlag: true } };
      const adapterIdentifiers = ['memory'];

      expect(getIsFeatureEnabled(allFlags, adapterIdentifiers, 'fooFlag')).toBe(
        true
      );
    });

    it('should indicate feature being disabled', () => {
      const allFlags = { memory: { fooFlag: false } };
      const adapterIdentifiers = ['memory'];

      expect(getIsFeatureEnabled(allFlags, adapterIdentifiers, 'fooFlag')).toBe(
        false
      );
    });
  });
});

describe('with non existing flag', () => {
  it('should indicate feature being disabled', () => {
    const allFlags = { memory: { fooFlag: true } };
    const adapterIdentifiers = ['memory'];

    expect(getIsFeatureEnabled(allFlags, adapterIdentifiers, 'fooFlag2')).toBe(
      false
    );
  });
});
