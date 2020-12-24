import createCache from './cache';

const cachePrefix = 'test';

describe('setting a value', () => {
  describe('when the value does not exist', () => {
    it('should set the value in the cache', () => {
      const cache = createCache({ prefix: cachePrefix });

      cache.set('foo', 'bar');

      expect(
        JSON.parse(sessionStorage.getItem(`${cachePrefix}__foo`))
      ).toStrictEqual('bar');
    });
  });

  describe('when the value exists', () => {
    it('should set and overwrite the value in the cache', () => {
      const cache = createCache({ prefix: cachePrefix });

      cache.set('foo', 'bar');
      cache.set('foo', 'baz');

      expect(
        JSON.parse(sessionStorage.getItem(`${cachePrefix}__foo`))
      ).toStrictEqual('baz');
    });
  });
});

describe('getting a value', () => {
  describe('when the value exists', () => {
    it('should set and overwrite the value in the cache', () => {
      const cache = createCache({ prefix: cachePrefix });

      cache.set('foo', 'bar');

      expect(
        JSON.parse(sessionStorage.getItem(`${cachePrefix}__foo`))
      ).toStrictEqual('bar');
    });
  });

  describe('when the value is valid JSON', () => {
    it('should set and overwrite the value in the cache', () => {
      const cache = createCache({ prefix: cachePrefix });
      const json = { foo: 'foo' };

      cache.set('foo', json);

      expect(
        JSON.parse(sessionStorage.getItem(`${cachePrefix}__foo`))
      ).toStrictEqual(json);
    });
  });
});

describe('unsetting a value', () => {
  it('should unset the value in the cache', () => {
    const cache = createCache({ prefix: cachePrefix });

    cache.set('foo', 'bar');
    expect(
      JSON.parse(sessionStorage.getItem(`${cachePrefix}__foo`))
    ).toStrictEqual('bar');

    cache.unset('foo', 'bar');

    expect(
      JSON.parse(sessionStorage.getItem(`${cachePrefix}__foo`))
    ).toBeNull();
  });
});
