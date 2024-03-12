import {
  cacheIdentifiers,
  type TCacheIdentifiers,
  type TFlags,
} from '@flopflip/types';
import { type LDContext } from 'launchdarkly-js-client-sdk';

const CACHE_PREFIX = '@flopflip/launchdarkly-adapter';
const FLAGS_KEY = 'flags';
const FLAGS_REFERENCE_KEY = 'flags-reference';

async function importCache(cacheIdentifier: TCacheIdentifiers) {
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

  return cacheModule;
}

async function getCache(
  cacheIdentifier: TCacheIdentifiers,
  cacheKey: LDContext['key']
) {
  const cacheModule = await importCache(cacheIdentifier);

  const createCache = cacheModule.default;
  const flagsCachePrefix = [CACHE_PREFIX, cacheKey].filter(Boolean).join('/');

  const flagsCache = createCache({ prefix: flagsCachePrefix });
  const referenceCache = createCache({ prefix: CACHE_PREFIX });

  return {
    set(flags: TFlags) {
      const haveFlagsBeenWritten = flagsCache.set(FLAGS_KEY, flags);

      if (haveFlagsBeenWritten) {
        referenceCache.set(
          FLAGS_REFERENCE_KEY,
          [flagsCachePrefix, FLAGS_KEY].join('/')
        );
      }

      return haveFlagsBeenWritten;
    },
    get() {
      return flagsCache.get(FLAGS_KEY);
    },
    unset() {
      referenceCache.unset(FLAGS_REFERENCE_KEY);

      return flagsCache.unset(FLAGS_KEY);
    },
  };
}

async function getCachedFlags(cacheIdentifier: TCacheIdentifiers) {
  const cacheModule = await importCache(cacheIdentifier);

  const createCache = cacheModule.default;

  const referenceCache = createCache({ prefix: CACHE_PREFIX });

  const reference = referenceCache.get(FLAGS_REFERENCE_KEY);

  if (reference) {
    // Cache without prefix as the reference is already prefixed.
    const flagsCache = createCache({ prefix: '' });

    return flagsCache.get(reference);
  }
}

export { CACHE_PREFIX, getCache, getCachedFlags };
