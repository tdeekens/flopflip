import { describe, expect, it } from 'vitest';
import { createCache } from '../src/cache';

const cachePrefix = 'test';

describe('setting a value', () => {
  describe('when the value does not exist', () => {
    it('should set the value in the cache', () => {
      const cache = createCache({ prefix: cachePrefix });

      cache.set('foo', 'bar');

      expect(
        JSON.parse(localStorage.getItem(`${cachePrefix}/foo`))
      ).toStrictEqual('bar');
    });
  });

  describe('when the value exists', () => {
    it('should set and overwrite the value in the cache', () => {
      const cache = createCache({ prefix: cachePrefix });

      cache.set('foo', 'bar');
      cache.set('foo', 'baz');

      expect(
        JSON.parse(localStorage.getItem(`${cachePrefix}/foo`))
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
        JSON.parse(localStorage.getItem(`${cachePrefix}/foo`))
      ).toStrictEqual('bar');
    });
  });

  describe('when the value is valid JSON', () => {
    it('should set and overwrite the value in the cache', () => {
      const cache = createCache({ prefix: cachePrefix });
      const json = { foo: 'foo' };

      cache.set('foo', json);

      expect(
        JSON.parse(localStorage.getItem(`${cachePrefix}/foo`))
      ).toStrictEqual(json);
    });
  });
});

describe('unsetting a value', () => {
  it('should unset the value in the cache', () => {
    const cache = createCache({ prefix: cachePrefix });

    cache.set('foo', 'bar');
    expect(
      JSON.parse(localStorage.getItem(`${cachePrefix}/foo`))
    ).toStrictEqual('bar');

    cache.unset('foo', 'bar');

    expect(JSON.parse(localStorage.getItem(`${cachePrefix}/foo`))).toBeNull();
  });
});
