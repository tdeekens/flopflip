# @flopflip/launchdarkly-adapter

## 2.14.3

### Patch Changes

- [`52ccb88`](https://github.com/tdeekens/flopflip/commit/52ccb880b7a2948ff3ee46b3f51613be6a99ee3f) [#1204](https://github.com/tdeekens/flopflip/pull/1204) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor(launchdarkly-adapter): to use emitter

## 2.14.2

### Patch Changes

- [`9460803`](https://github.com/tdeekens/flopflip/commit/9460803fb19339c015077c888141c4322d1b598c) [#1198](https://github.com/tdeekens/flopflip/pull/1198) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: export of updateFlags re-export edition

## 2.14.1

### Patch Changes

- [`4150b1d`](https://github.com/tdeekens/flopflip/commit/4150b1dfc8e022ffcc8055f061be14a400ac62ae) [#1196](https://github.com/tdeekens/flopflip/pull/1196) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: export of updateFlags

## 2.14.0

### Minor Changes

- [`17bbc54`](https://github.com/tdeekens/flopflip/commit/17bbc545dd476728a5bdedc566b46ec9cc3753c1) [#1189](https://github.com/tdeekens/flopflip/pull/1189) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: add the notion of locked flags and `updateFlags` to 3 out of 4 adapters

  The three adapters `launchdarkly-adapter`, `localstorage-adapter` and `memory-adapter` now expose a `updateFlags` method.

  You can now:

  ```js
  import { updateFlags } from '@flopflip/launchdarkly-adapter';

  updateFlags({ myFlag: true });
  ```

  which will internally set the flag value of `myFlag` to `true` and lock the flag from changing via the LaunchDarkly API. You can pass `{ lockFlags: false }` as an second argument to keep flag updates.

  The same applied for the `localstorage-adapter` adapter. Where updating a flag will not yield it being locked but you can opt-in via `{ lockFlags: true }`. So far only the `launchdarkly-adapter` locks flags by default when using `updateFlags`. This default is sensible as flag value can easily be overwritten by the LaunchDarkly socket connection giving an update.

## 2.13.4

### Patch Changes

- [`76354f8`](https://github.com/tdeekens/flopflip/commit/76354f8bd034b0ece14374b5eddf39858f75c7a7) [#1143](https://github.com/tdeekens/flopflip/pull/1143) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

- Updated dependencies [[`76354f8`](https://github.com/tdeekens/flopflip/commit/76354f8bd034b0ece14374b5eddf39858f75c7a7)]:
  - @flopflip/types@2.5.4

## 2.13.3

### Patch Changes

- [`32cc6a8`](https://github.com/tdeekens/flopflip/commit/32cc6a823ff9812ab2f256b69dd3f46e273feb5e) [#1102](https://github.com/tdeekens/flopflip/pull/1102) Thanks [@tdeekens](https://github.com/tdeekens)! - Update dependencies (TypeScript 3.9)

- Updated dependencies [[`32cc6a8`](https://github.com/tdeekens/flopflip/commit/32cc6a823ff9812ab2f256b69dd3f46e273feb5e)]:
  - @flopflip/types@2.5.3
