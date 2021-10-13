import { TCache, TCacheOptions } from '@flopflip/types';

const createCache = (options: TCacheOptions) => {
  const cache: TCache = {
    get: (key) => {
      const localStorageValue = localStorage.getItem(
        [options.prefix, key].join('/')
      );

      return localStorageValue ? JSON.parse(localStorageValue) : null;
    },
    set: (key, value) => {
      try {
        localStorage.setItem(
          [options.prefix, key].join('/'),
          JSON.stringify(value)
        );
        return true;
        // eslint-disable-next-line
      } catch (_error) {
        return false;
      }
    },
    unset: (key) => {
      localStorage.removeItem([options.prefix, key].join('/'));
    },
  };

  return cache;
};

export default createCache;
