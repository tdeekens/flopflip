import { adapterIdentifiers, cacheIdentifiers } from '@flopflip/types';

import {
  getAllCachedFlags,
  getCache,
  getCachedFlags,
  getCachePrefix,
} from './cache';

const cacheKey = 'test';

describe('general caching', () => {
  it('should allow writing values to the cache', async () => {
    const flags = {
      flag1: true,
    };
    const cache = await getCache(
      cacheIdentifiers.session,
      adapterIdentifiers.memory,
      cacheKey
    );

    cache.set(flags);

    expect(cache.get()).toStrictEqual(flags);
  });

  it('should allow unsetting values from the cache', async () => {
    const flags = {
      flag1: true,
    };
    const cache = await getCache(
      cacheIdentifiers.session,
      adapterIdentifiers.memory,
      cacheKey
    );

    cache.set(flags);
    cache.unset();

    expect(cache.get()).toBeNull();
  });

  it('should update a referencing cache to the values cache', async () => {
    const flags = {
      flag1: true,
    };
    const cache = await getCache(
      cacheIdentifiers.session,
      adapterIdentifiers.memory,
      cacheKey
    );

    cache.set(flags);

    expect(sessionStorage.getItem).toHaveBeenLastCalledWith(
      `${getCachePrefix(adapterIdentifiers.memory)}/${cacheKey}/flags`
    );
  });
});

describe('flag caching', () => {
  describe('with a single adapter', () => {
    it('should allow writing and getting cached flags', async () => {
      const flags = {
        flag1: true,
      };
      const cache = await getCache(
        cacheIdentifiers.session,
        adapterIdentifiers.memory,
        cacheKey
      );

      cache.set(flags);

      expect(
        getCachedFlags(cacheIdentifiers.session, adapterIdentifiers.memory)
      ).toStrictEqual(flags);

      expect(sessionStorage.getItem).toHaveBeenLastCalledWith(
        `${getCachePrefix(adapterIdentifiers.memory)}/${cacheKey}/flags`
      );
    });
  });
  describe('with a multiple adapters', () => {
    it('should allow writing and getting cached flags for all adapters', async () => {
      const memoryAdapterFlags = {
        flag1: true,
      };
      const localstorageAdapterFlags = {
        flag2: true,
      };

      const memoryAdapterCache = await getCache(
        cacheIdentifiers.session,
        adapterIdentifiers.memory,
        cacheKey
      );
      const localstorageAdapterCache = await getCache(
        cacheIdentifiers.session,
        adapterIdentifiers.localstorage,
        cacheKey
      );

      localstorageAdapterCache.set(localstorageAdapterFlags);

      const fakeAdapter = {
        effectIds: [adapterIdentifiers.memory, adapterIdentifiers.localstorage],
      };

      expect(
        getAllCachedFlags(fakeAdapter, cacheIdentifiers.session)
      ).toStrictEqual({ ...memoryAdapterFlags, ...localstorageAdapterFlags });
    });
  });
});
