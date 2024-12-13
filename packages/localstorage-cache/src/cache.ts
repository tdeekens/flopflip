import type { TCache, TCacheOptions } from '@flopflip/types';

const createCache = (options: TCacheOptions) => {
  const cache: TCache = {
    get(key) {
      const cacheKey = [options.prefix, key].join('/');

      const localStorageValue = localStorage.getItem(cacheKey);

      return localStorageValue ? JSON.parse(localStorageValue) : null;
    },
    set(key, value) {
      try {
        const cacheKey = [options.prefix, key].join('/');

        localStorage.setItem(cacheKey, JSON.stringify(value));

        return true;
      } catch (_error) {
        return false;
      }
    },
    unset(key) {
      const cacheKey = [options.prefix, key].join('/');

      localStorage.removeItem(cacheKey);
    },
  };

  return cache;
};

export { createCache };
