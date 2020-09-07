# @flopflip/splitio-adapter

## 1.9.4

### Patch Changes

- Updated dependencies [[`651a0ac`](https://github.com/tdeekens/flopflip/commit/651a0ac187860c9511d7da0bbf7cde6f5a9bb5aa)]:
  - @flopflip/types@2.5.8

## 1.9.3

### Patch Changes

- [`407f8e7`](https://github.com/tdeekens/flopflip/commit/407f8e7484ef25316d34f14f29b94c673ecd8aed) [#1235](https://github.com/tdeekens/flopflip/pull/1235) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps and migrate to TypeScript v4

* [`407f8e7`](https://github.com/tdeekens/flopflip/commit/407f8e7484ef25316d34f14f29b94c673ecd8aed) [#1235](https://github.com/tdeekens/flopflip/pull/1235) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

* Updated dependencies [[`407f8e7`](https://github.com/tdeekens/flopflip/commit/407f8e7484ef25316d34f14f29b94c673ecd8aed)]:
  - @flopflip/types@2.5.7

## 1.9.2

### Patch Changes

- [`de8c944`](https://github.com/tdeekens/flopflip/commit/de8c944a76b5fb7185f4eccb70bb40920c3cccb0) [#1225](https://github.com/tdeekens/flopflip/pull/1225) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: to check subscription of flag upon initial sdk fetch

## 1.9.1

### Patch Changes

- [`6034a1c`](https://github.com/tdeekens/flopflip/commit/6034a1c8ff2c166f3fabee1deac86cf6262edde3) [#1214](https://github.com/tdeekens/flopflip/pull/1214) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor(cypress-plugin): type the global flopflip

- Updated dependencies [[`6034a1c`](https://github.com/tdeekens/flopflip/commit/6034a1c8ff2c166f3fabee1deac86cf6262edde3)]:
  - @flopflip/types@2.5.6

## 1.9.0

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

## 1.8.6

### Patch Changes

- [`b4dd923`](https://github.com/tdeekens/flopflip/commit/b4dd92356208ffe1feefea0a86f7c05d738fcabb) [#1208](https://github.com/tdeekens/flopflip/pull/1208) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: types dependency

## 1.8.5

### Patch Changes

- [`17bbc54`](https://github.com/tdeekens/flopflip/commit/17bbc545dd476728a5bdedc566b46ec9cc3753c1) [#1189](https://github.com/tdeekens/flopflip/pull/1189) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: add the notion of locked flags and `updateFlags` to 3 out of 4 adapters

  The three adapters `launchdarkly-adapter`, `localstorage-adapter` and `memory-adapter` now expose a `updateFlags` method.

  You can now:

  ```js
  import { updateFlags } from '@flopflip/launchdarkly-adapter';

  updateFlags({ myFlag: true });
  ```

  which will internally set the flag value of `myFlag` to `true` and lock the flag from changing via the LaunchDarkly API. You can pass `{ lockFlags: false }` as an second argument to keep flag updates.

  The same applied for the `localstorage-adapter` adapter. Where updating a flag will not yield it being locked but you can opt-in via `{ lockFlags: true }`. So far only the `launchdarkly-adapter` locks flags by default when using `updateFlags`. This default is sensible as flag value can easily be overwritten by the LaunchDarkly socket connection giving an update.

## 1.8.4

### Patch Changes

- [`76354f8`](https://github.com/tdeekens/flopflip/commit/76354f8bd034b0ece14374b5eddf39858f75c7a7) [#1143](https://github.com/tdeekens/flopflip/pull/1143) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

- Updated dependencies [[`76354f8`](https://github.com/tdeekens/flopflip/commit/76354f8bd034b0ece14374b5eddf39858f75c7a7)]:
  - @flopflip/types@2.5.4

## 1.8.3

### Patch Changes

- [`32cc6a8`](https://github.com/tdeekens/flopflip/commit/32cc6a823ff9812ab2f256b69dd3f46e273feb5e) [#1102](https://github.com/tdeekens/flopflip/pull/1102) Thanks [@tdeekens](https://github.com/tdeekens)! - Update dependencies (TypeScript 3.9)

- Updated dependencies [[`32cc6a8`](https://github.com/tdeekens/flopflip/commit/32cc6a823ff9812ab2f256b69dd3f46e273feb5e)]:
  - @flopflip/types@2.5.3
