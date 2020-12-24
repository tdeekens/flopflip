import { TCacheOptions, TCache } from '@flopflip/types';

const createCache = (options: TCacheOptions) => {
  const cache: TCache = {
    get: (key) => {
      const sessionStorageValue = sessionStorage.getItem(
        `${options.prefix}__${key}`
      );

      return sessionStorageValue ? JSON.parse(sessionStorageValue) : null;
    },
    set: (key, value) => {
      try {
        sessionStorage.setItem(
          `${options.prefix}__${key}`,
          JSON.stringify(value)
        );
        return true;
        // eslint-disable-next-line
      } catch (_error) {
        return false;
      }
    },
    unset: (key) => sessionStorage.removeItem(`${options.prefix}__${key}`),
  };

  return cache;
};

export default createCache;
