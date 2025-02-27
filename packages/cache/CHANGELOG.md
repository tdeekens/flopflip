# @flopflip/cache

## 15.0.0

### Major Changes

- [#2001](https://github.com/tdeekens/flopflip/pull/2001) [`fb263d3`](https://github.com/tdeekens/flopflip/commit/fb263d3762d1cff0220a094d445561141a31f01c) Thanks [@tdeekens](https://github.com/tdeekens)! - Requires react 18.x, react-redux 9.x and redux 5.x.

### Patch Changes

- [#1980](https://github.com/tdeekens/flopflip/pull/1980) [`40db6e1`](https://github.com/tdeekens/flopflip/commit/40db6e198cc252a8784ae96abde605a70990e1d1) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependencies.

- [#1923](https://github.com/tdeekens/flopflip/pull/1923) [`f62ab95`](https://github.com/tdeekens/flopflip/commit/f62ab955815a295c23c1f2dab3901f6d5cbbc570) Thanks [@YahiaElTai](https://github.com/YahiaElTai)! - Replace eslint with biome

- [#1974](https://github.com/tdeekens/flopflip/pull/1974) [`216ec4e`](https://github.com/tdeekens/flopflip/commit/216ec4ea59fa43863ef1dfe9ba56365e542b53e3) Thanks [@tdeekens](https://github.com/tdeekens)! - Refactor to remove internal barrel files.

- [#1967](https://github.com/tdeekens/flopflip/pull/1967) [`7f1edb3`](https://github.com/tdeekens/flopflip/commit/7f1edb3105e589dae0b1d118111577c007f887cf) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependencies

- [#1970](https://github.com/tdeekens/flopflip/pull/1970) [`6799832`](https://github.com/tdeekens/flopflip/commit/6799832bddb9a60ba6a8988974815998bead6ab0) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependencies

- [#1994](https://github.com/tdeekens/flopflip/pull/1994) [`5df599d`](https://github.com/tdeekens/flopflip/commit/5df599d181739136dc01a1f0b0ed237c1f8a4570) Thanks [@tdeekens](https://github.com/tdeekens)! - Refactor to use turborepo and tsup

- Updated dependencies [[`40db6e1`](https://github.com/tdeekens/flopflip/commit/40db6e198cc252a8784ae96abde605a70990e1d1), [`fb263d3`](https://github.com/tdeekens/flopflip/commit/fb263d3762d1cff0220a094d445561141a31f01c), [`7f1edb3`](https://github.com/tdeekens/flopflip/commit/7f1edb3105e589dae0b1d118111577c007f887cf), [`6799832`](https://github.com/tdeekens/flopflip/commit/6799832bddb9a60ba6a8988974815998bead6ab0), [`1f527fc`](https://github.com/tdeekens/flopflip/commit/1f527fcdddcc2aa3009a1384810f28233c3fc141)]:
  - @flopflip/types@15.0.0
  - @flopflip/localstorage-cache@15.0.0
  - @flopflip/sessionstorage-cache@15.0.0

## 14.0.2

### Patch Changes

- [#1922](https://github.com/tdeekens/flopflip/pull/1922) [`56f387f`](https://github.com/tdeekens/flopflip/commit/56f387f510f62d169eb103321c889545f71a4c66) Thanks [@tdeekens](https://github.com/tdeekens)! - Refactor cache keys to be bound to adapter context.

- [#1907](https://github.com/tdeekens/flopflip/pull/1907) [`700a2b2`](https://github.com/tdeekens/flopflip/commit/700a2b2c5921e0760ec2f4e43294718129109eed) Thanks [@renovate](https://github.com/apps/renovate)! - Update react and react-dom while removing usage of defaultProps.

- Updated dependencies [[`700a2b2`](https://github.com/tdeekens/flopflip/commit/700a2b2c5921e0760ec2f4e43294718129109eed)]:
  - @flopflip/sessionstorage-cache@14.0.2
  - @flopflip/localstorage-cache@14.0.2
  - @flopflip/types@14.0.2

## 14.0.1

### Patch Changes

- [#1896](https://github.com/tdeekens/flopflip/pull/1896) [`66df5a0`](https://github.com/tdeekens/flopflip/commit/66df5a08a4882279d6479cb7293627fe970b52e0) Thanks [@renovate](https://github.com/apps/renovate)! - Update to pnpm v9

- Updated dependencies [[`66a404d`](https://github.com/tdeekens/flopflip/commit/66a404daec61c1b048de4ea44ab5f0bf600b931b), [`66df5a0`](https://github.com/tdeekens/flopflip/commit/66df5a08a4882279d6479cb7293627fe970b52e0)]:
  - @flopflip/types@14.0.1
  - @flopflip/sessionstorage-cache@14.0.1
  - @flopflip/localstorage-cache@14.0.1

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
