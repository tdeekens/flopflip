import {
  type TAdapter,
  type TAdapterIdentifiers,
  type TCacheIdentifiers,
  type TFlags,
  cacheIdentifiers,
} from '@flopflip/types';

const FLAGS_CACHE_KEY = 'flags';
const FLAGS_REFERENCE_CACHE_KEY = 'flags-reference';

function getCachePrefix(adapterIdentifiers: TAdapterIdentifiers) {
  return `@flopflip/${adapterIdentifiers}-adapter`;
}

export function encodeCacheContext(cacheContext: any) {
  const encodedAsJson = JSON.stringify(cacheContext);

  const hashCode = [...encodedAsJson].reduce(
    (hash, c) => (Math.imul(31, hash) + c.charCodeAt(0)) | 0,
    0
  );

  const encodedCacheContext = Math.abs(hashCode).toString();

  return encodedCacheContext;
}

async function importCache(cacheIdentifier: TCacheIdentifiers) {
  let cacheModule: any;

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
  adapterIdentifiers: TAdapterIdentifiers,
  cacheContext?: any
) {
  const cacheModule = await importCache(cacheIdentifier);

  const CACHE_PREFIX = getCachePrefix(adapterIdentifiers);
  const createCache = cacheModule.createCache;
  let encodedCacheContext = '';
  try {
    encodedCacheContext = encodeCacheContext(cacheContext);
  } catch (_) {
    // continue regardless of error
  }

  const flagsCachePrefix = [CACHE_PREFIX, encodedCacheContext]
    .filter(Boolean)
    .join('/');

  const flagsCache = createCache({ prefix: flagsCachePrefix });
  const referenceCache = createCache({ prefix: CACHE_PREFIX });

  return {
    set(flags: TFlags) {
      const haveFlagsBeenWritten = flagsCache.set(FLAGS_CACHE_KEY, flags);

      if (haveFlagsBeenWritten) {
        referenceCache.set(
          FLAGS_REFERENCE_CACHE_KEY,
          [flagsCachePrefix, FLAGS_CACHE_KEY].join('/')
        );
      }

      return haveFlagsBeenWritten;
    },
    get() {
      return flagsCache.get(FLAGS_CACHE_KEY);
    },
    unset() {
      referenceCache.unset(FLAGS_REFERENCE_CACHE_KEY);

      return flagsCache.unset(FLAGS_CACHE_KEY);
    },
  };
}

function getCachedFlags(
  cacheIdentifier: TCacheIdentifiers,
  adapterIdentifiers: TAdapterIdentifiers
): TFlags {
  const CACHE_PREFIX = getCachePrefix(adapterIdentifiers);

  const cacheModule =
    cacheIdentifier === cacheIdentifiers.local ? localStorage : sessionStorage;
  const flagReferenceKey = [CACHE_PREFIX, FLAGS_REFERENCE_CACHE_KEY].join('/');

  const referenceToCachedFlags = cacheModule.getItem(flagReferenceKey);

  if (referenceToCachedFlags) {
    try {
      const cacheKey: string = JSON.parse(referenceToCachedFlags);
      const cachedFlags = cacheModule.getItem(cacheKey);

      if (cacheKey && cachedFlags) {
        return JSON.parse(cachedFlags);
      }
    } catch (_) {
      console.warn(
        `@flopflip/cache: Failed to parse cached flags from ${cacheIdentifier}.`
      );
    }
  }

  return {};
}

function getAllCachedFlags(
  adapter: TAdapter,
  cacheIdentifier?: TCacheIdentifiers
) {
  if (!cacheIdentifier) {
    return {};
  }

  if (adapter.effectIds) {
    return adapter.effectIds.reduce(
      (defaultFlags, effectId) => ({
        ...defaultFlags,
        ...getCachedFlags(cacheIdentifier, effectId),
      }),
      {}
    );
  }

  return getCachedFlags(cacheIdentifier, adapter.id);
}

export { getAllCachedFlags, getCache, getCachedFlags, getCachePrefix };
