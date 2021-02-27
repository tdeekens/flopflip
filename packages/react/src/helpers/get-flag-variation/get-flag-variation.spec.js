import warning from 'tiny-warning';

import getFlagVariation from './get-flag-variation';

jest.mock('tiny-warning');

describe('with a single adapter interface identifier', () => {
  describe('with existing flag variation', () => {
    describe('with flag variation', () => {
      describe('with string variation', () => {
        it('should return the flag variation', () => {
          const allFlags = { memory: { fooFlag: 'foo-variation' } };
          const adapterIdentifiers = ['memory'];

          expect(
            getFlagVariation(allFlags, adapterIdentifiers, 'fooFlag')
          ).toBe('foo-variation');
        });
      });

      describe('with number variation', () => {
        it('should return the flag variation', () => {
          const allFlags = { memory: { fooFlag: 123 } };
          const adapterIdentifiers = ['memory'];

          expect(
            getFlagVariation(allFlags, adapterIdentifiers, 'fooFlag')
          ).toBe(123);
        });
      });

      describe('with object variation', () => {
        it('should return the flag variation', () => {
          const allFlags = { memory: { fooFlag: { a: 'b' } } };
          const adapterIdentifiers = ['memory'];

          expect(
            getFlagVariation(allFlags, adapterIdentifiers, 'fooFlag')
          ).toStrictEqual({ a: 'b' });
        });
      });
    });
  });

  describe('with non normalized flag variation', () => {
    it('should return the flag variation', () => {
      const allFlags = { memory: { fooFlag: true } };
      const adapterIdentifiers = ['memory'];

      expect(getFlagVariation(allFlags, adapterIdentifiers, 'foo-flag')).toBe(
        true
      );
    });

    it('should invoke `warning`', () => {
      const allFlags = { memory: { fooFlag: false } };
      const adapterIdentifiers = ['memory'];

      getFlagVariation(allFlags, adapterIdentifiers, 'fooFlag');

      expect(warning).toHaveBeenCalled();
    });
  });

  describe('with non existing flag variation', () => {
    it('should indicate flag variation not existing', () => {
      const allFlags = { memory: { fooFlag: true } };
      const adapterIdentifiers = ['memory'];

      expect(getFlagVariation(allFlags, adapterIdentifiers, 'fooFlag2')).toBe(
        false
      );
    });
  });
});

describe('with multiple adapter interface identifier', () => {
  describe('with existing flag variation', () => {
    describe('with multiple matching flag variations as strings', () => {
      it('should return the first matching flag variation', () => {
        const allFlags = {
          memory: { fooFlag: 'memory-foo-variation' },
          graphql: { fooFlag: 'graphql-foo-variation' },
        };
        const adapterIdentifiers = ['memory', 'graphql'];

        expect(getFlagVariation(allFlags, adapterIdentifiers, 'fooFlag')).toBe(
          'memory-foo-variation'
        );
      });
    });

    describe('with multiple matching flag variations one being a boolean', () => {
      it('should return the first matching boolean flag variation', () => {
        const allFlags = {
          memory: { fooFlag: false },
          graphql: { fooFlag: 'graphql-foo-variation' },
        };
        const adapterIdentifiers = ['memory', 'graphql'];

        expect(getFlagVariation(allFlags, adapterIdentifiers, 'fooFlag')).toBe(
          false
        );
      });
    });

    describe('with a single matching flag variations', () => {
      it('should return the first matching flag variation', () => {
        const allFlags = {
          memory: { fooFlag: null },
          graphql: { fooFlag: 'graphql-foo-variation' },
        };
        const adapterIdentifiers = ['memory', 'graphql'];

        expect(getFlagVariation(allFlags, adapterIdentifiers, 'fooFlag')).toBe(
          'graphql-foo-variation'
        );
      });
    });
  });
});
