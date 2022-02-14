import { TCache, TCacheOptions } from '@flopflip/types';

const createCache = (options: TCacheOptions) => {
  const cache: TCache = {
    get(key) {
      const sessionStorageValue = sessionStorage.getItem(
        [options.prefix, key].join('/')
      );

      return sessionStorageValue ? JSON.parse(sessionStorageValue) : null;
    },
    set(key, value) {
      try {
        sessionStorage.setItem(
          [options.prefix, key].join('/'),
          JSON.stringify(value)
        );
        return true;
        // eslint-disable-next-line
      } catch (_error) {
        return false;
      }
    },
    unset(key) {
      sessionStorage.removeItem([options.prefix, key].join('/'));
    },
  };

  return cache;
};

export default createCache;
