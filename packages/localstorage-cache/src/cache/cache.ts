import { TCacheOptions, TCache } from '@flopflip/types';

const createCache = (options: TCacheOptions) => {
  const cache: TCache = {
    get: (key) => {
      const localStorageValue = localStorage.getItem(
        `${options.prefix}__${key}`
      );

      return localStorageValue ? JSON.parse(localStorageValue) : null;
    },
    set: (key, value) => {
      try {
        localStorage.setItem(
          `${options.prefix}__${key}`,
          JSON.stringify(value)
        );
        return true;
        // eslint-disable-next-line
      } catch (_error) {
        return false;
      }
    },
    unset: (key) => {
      localStorage.removeItem(`${options.prefix}__${key}`)
    },
  };

  return cache;
};

export default createCache;
