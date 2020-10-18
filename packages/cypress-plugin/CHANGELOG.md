# @flopflip/cypress-plugin

## 1.0.3

### Patch Changes

- [`5598832`](https://github.com/tdeekens/flopflip/commit/5598832df710f707fe0832cd4011e26c060e24a8) [#1275](https://github.com/tdeekens/flopflip/pull/1275) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

## 1.0.2

### Patch Changes

- [`eac3bd4`](https://github.com/tdeekens/flopflip/commit/eac3bd4d80fee4209ed39d7b9199916afb7f192f) [#1269](https://github.com/tdeekens/flopflip/pull/1269) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update dependencies across packages

## 1.0.1

### Patch Changes

- [`407f8e7`](https://github.com/tdeekens/flopflip/commit/407f8e7484ef25316d34f14f29b94c673ecd8aed) [#1235](https://github.com/tdeekens/flopflip/pull/1235) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps and migrate to TypeScript v4

* [`407f8e7`](https://github.com/tdeekens/flopflip/commit/407f8e7484ef25316d34f14f29b94c673ecd8aed) [#1235](https://github.com/tdeekens/flopflip/pull/1235) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

## 1.0.0

### Major Changes

- [`1bb0d43`](https://github.com/tdeekens/flopflip/commit/1bb0d43eda0e7ca61318ac388e07b93be97e591a) [#1226](https://github.com/tdeekens/flopflip/pull/1226) Thanks [@tdeekens](https://github.com/tdeekens)! - feat(cypress-plugin): release as 1.0.0

## 0.1.3

### Patch Changes

- [`a5e6c12`](https://github.com/tdeekens/flopflip/commit/a5e6c128f01af09ff14dc295e7ea1a05474a6be5) [#1216](https://github.com/tdeekens/flopflip/pull/1216) Thanks [@tdeekens](https://github.com/tdeekens)! - fix(cypress-plugin): to wait for global

## 0.1.2

### Patch Changes

- [`6034a1c`](https://github.com/tdeekens/flopflip/commit/6034a1c8ff2c166f3fabee1deac86cf6262edde3) [#1214](https://github.com/tdeekens/flopflip/pull/1214) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor(cypress-plugin): type the global flopflip

* [`6034a1c`](https://github.com/tdeekens/flopflip/commit/6034a1c8ff2c166f3fabee1deac86cf6262edde3) [#1214](https://github.com/tdeekens/flopflip/pull/1214) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor(cypress-plugin): to use cy.window

## 0.1.1

### Patch Changes

- [`58022c9`](https://github.com/tdeekens/flopflip/commit/58022c97abf4deaa2b9461f2750a1756524cae6d) [#1212](https://github.com/tdeekens/flopflip/pull/1212) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: the name of the namespace

## 0.1.0

### Minor Changes

- [`3ef69dd`](https://github.com/tdeekens/flopflip/commit/3ef69dde568307a57ab6254f699eb5fe1d10f476) [#1210](https://github.com/tdeekens/flopflip/pull/1210) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: to expose adapters globally

  Exposing adapters globally simplifies a lot of integrations we can perform. Each adapter gets a namespace according to its `TAdapterInterfaceIdentifiers`. So we have `launchdarkly`, `memory`, etc on the `__flopflip__` global namespace.

  We use the `globalThis` polyfill and TC39 spec to correctly determine the global this in any context and assign each adapter instance as `adapter` and `updateFlags`.

  This means you could do `window.__flopflip__.launchdarkly.updateFlags` now.

  With the next version of the `cypress-plugin` we also simplify the API. As we're not `1.x.x` we don't consider it breaking. You now have to pass an `TAdapterInterfaceIdentifiers` so that the plugin can correlate the adapter internally. This means you could do

  ```diff
  +addCommands({ adapterId: 'launchdarkly' })
  -addCommands({ adapter: adapter, updateFlags, updateFlags })
  ```

## 0.0.7

### Patch Changes

- [`b4dd923`](https://github.com/tdeekens/flopflip/commit/b4dd92356208ffe1feefea0a86f7c05d738fcabb) [#1208](https://github.com/tdeekens/flopflip/pull/1208) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: types dependency

## 0.0.6

### Patch Changes

- [`8f7e504`](https://github.com/tdeekens/flopflip/commit/8f7e504951cb2dcb6b86abaa4908d10314515860) [#1206](https://github.com/tdeekens/flopflip/pull/1206) Thanks [@tdeekens](https://github.com/tdeekens)! - feat(launchdarkly-adapter): add unsubcribe flag state

## 0.0.5

### Patch Changes

- [`7b4ff69`](https://github.com/tdeekens/flopflip/commit/7b4ff69d14f2a86db7d70107134cc33b3028f5e9) [#1202](https://github.com/tdeekens/flopflip/pull/1202) Thanks [@tdeekens](https://github.com/tdeekens)! - chore(cypress-plugin): add logging

## 0.0.4

### Patch Changes

- [`8f444cc`](https://github.com/tdeekens/flopflip/commit/8f444cc6f9966baecdb4bf250172cb51e5cfd81a) [#1200](https://github.com/tdeekens/flopflip/pull/1200) Thanks [@tdeekens](https://github.com/tdeekens)! - fix(cypress-plugin): move to add commands

## 0.0.3

### Patch Changes

- [`b27e1fc`](https://github.com/tdeekens/flopflip/commit/b27e1fc2b6cb719f74e6ddd02fb5947ed09a23a9) [#1194](https://github.com/tdeekens/flopflip/pull/1194) Thanks [@tdeekens](https://github.com/tdeekens)! - fix(cypress-plugin): to build umd version

## 0.0.2

### Patch Changes

- [`e3ee875`](https://github.com/tdeekens/flopflip/commit/e3ee8753c908558bed2cd17127478ce0c0c2bad1) [#1192](https://github.com/tdeekens/flopflip/pull/1192) Thanks [@tdeekens](https://github.com/tdeekens)! - fix(cypress-plugin): entry point

## 0.0.1

### Patch Changes

- [`72cfeb7`](https://github.com/tdeekens/flopflip/commit/72cfeb7965faae227501dd4fb830b4e8b8662cb7) [#1191](https://github.com/tdeekens/flopflip/pull/1191) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: add cypress plugin
