import {
  cacheIdentifiers,
  type TCacheIdentifiers,
  type TFlags,
} from '@flopflip/types';
import { type LDContext } from 'launchdarkly-js-client-sdk';

const CACHE_PREFIX = '@flopflip/launchdarkly-adapter';

async function getCache(
  cacheIdentifier: TCacheIdentifiers,
  cacheKey: LDContext['key']
) {
  let cacheModule;

  switch (cacheIdentifier) {
    case cacheIdentifiers.local: {
      cacheModule = await import('@flopflip/localstorage-cache');
      break;
    }

    case cacheIdentifiers.session: {
      cacheModule = await import('@flopflip/sessionstorage-cache');
      break;
    }
  }

  const createCache = cacheModule.default;
  const cachePrefix = [CACHE_PREFIX, cacheKey].filter(Boolean).join('/');
  const cache = createCache({ prefix: cachePrefix });

  return {
    set(flags: TFlags) {
      return cache.set('flags', flags);
    },
    get() {
      return cache.get('flags');
    },
    unset() {
      return cache.unset('flags');
    },
  };
}

export { CACHE_PREFIX, getCache };
