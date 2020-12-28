import warning from 'tiny-warning';
import getFlagVariation from './get-flag-variation';

jest.mock('tiny-warning');

describe('with a single adapter interface identifier', () => {
  describe('with existing flag variation', () => {
    describe('with flag variation', () => {
      it('should return the flag variation', () => {
        const flags = { memory: { fooFlag: 'foo-variation' } };
        const adapterIdentifiers = ['memory'];

        expect(getFlagVariation(adapterIdentifiers, 'fooFlag')(flags)).toBe(
          'foo-variation'
        );
      });
    });
  });

  describe('with non normalized flag variation', () => {
    it('should return the flag variation', () => {
      const flags = { memory: { fooFlag: true } };
      const adapterIdentifiers = ['memory'];

      expect(getFlagVariation(adapterIdentifiers, 'foo-flag')(flags)).toBe(
        true
      );
    });

    it('should invoke `warning`', () => {
      const flags = { memory: { fooFlag: false } };
      const adapterIdentifiers = ['memory'];

      getFlagVariation(adapterIdentifiers, 'fooFlag')(flags);

      expect(warning).toHaveBeenCalled();
    });
  });

  describe('with non existing flag variation', () => {
    it('should indicate flag variation not existing', () => {
      const flags = { memory: { fooFlag: true } };
      const adapterIdentifiers = ['memory'];

      expect(getFlagVariation(adapterIdentifiers, 'fooFlag2')(flags)).toBe(
        false
      );
    });
  });
});

describe('with multiple adapter interface identifier', () => {
  describe('with existing flag variation', () => {
    describe('with multiple matching flag variations as strings', () => {
      it('should return the first matching flag variation', () => {
        const flags = {
          memory: { fooFlag: 'memory-foo-variation' },
          graphql: { fooFlag: 'graphql-foo-variation' },
        };
        const adapterIdentifiers = ['memory', 'graphql'];

        expect(getFlagVariation(adapterIdentifiers, 'fooFlag')(flags)).toBe(
          'memory-foo-variation'
        );
      });
    });

    describe('with multiple matching flag variations one being a boolean', () => {
      it('should return the first matching boolean flag variation', () => {
        const flags = {
          memory: { fooFlag: false },
          graphql: { fooFlag: 'graphql-foo-variation' },
        };
        const adapterIdentifiers = ['memory', 'graphql'];

        expect(getFlagVariation(adapterIdentifiers, 'fooFlag')(flags)).toBe(
          false
        );
      });
    });

    describe('with a single matching flag variations', () => {
      it('should return the first matching flag variation', () => {
        const flags = {
          memory: { fooFlag: null },
          graphql: { fooFlag: 'graphql-foo-variation' },
        };
        const adapterIdentifiers = ['memory', 'graphql'];

        expect(getFlagVariation(adapterIdentifiers, 'fooFlag')(flags)).toBe(
          'graphql-foo-variation'
        );
      });
    });
  });
});
