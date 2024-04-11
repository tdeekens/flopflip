# @flopflip/cache

## 14.0.0

### Major Changes

- [#1888](https://github.com/tdeekens/flopflip/pull/1888) [`72f308b`](https://github.com/tdeekens/flopflip/commit/72f308b6a2447fceeb84abc2198247354b5c2d43) Thanks [@tdeekens](https://github.com/tdeekens)! - The release adds a new `cacheMode` property on the `adapterArgs` of an adapter.

  Using the `cacheMode` you can opt into an `eager` or `lazy`. The `cacheMode` allows you to define when remote flags should take affect in an application. Before `flopflip` behaved always `eager`. This remains the case when passing `eager` or `null` as the `cacheMode`. In `lazy` mode `flopflip` will not directly flush remote values and only silently put them in the cache. They would then take effect on the next render or `reconfigure`.

  In short, the `cacheMode` can be `eager` to indicate that remote values should have effect immediately. The value can also be `lazy` to indicate that values should be updated in the cache but only be applied once the adapter is configured again

  With the `cacheMode` we removed some likely unused functionality which explored similar ideas before:

  1. `unsubscribeFromCachedFlags`: This is now always the case. You can use the `lazy` `cacheMode` to indicate that you don't want flags to take immediate effect
  2. `subscribeToFlagChanges`: This is now always true. You can't opt-out of the flag subscription any longer

### Patch Changes

- Updated dependencies [[`612461e`](https://github.com/tdeekens/flopflip/commit/612461ee77a6332f6481462a09c14375eb0e4001), [`72f308b`](https://github.com/tdeekens/flopflip/commit/72f308b6a2447fceeb84abc2198247354b5c2d43)]:
  - @flopflip/types@14.0.0
  - @flopflip/localstorage-cache@14.0.0
  - @flopflip/sessionstorage-cache@14.0.0
