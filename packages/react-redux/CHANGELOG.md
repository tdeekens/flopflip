# @flopflip/react-redux

## 10.2.6

### Patch Changes

- Updated dependencies [[`8c97b10`](https://github.com/tdeekens/flopflip/commit/8c97b10ce7159e8769791834bf6d7a1b5aba37f3)]:
  - @flopflip/types@2.5.9

## 10.2.5

### Patch Changes

- Updated dependencies [[`651a0ac`](https://github.com/tdeekens/flopflip/commit/651a0ac187860c9511d7da0bbf7cde6f5a9bb5aa)]:
  - @flopflip/types@2.5.8

## 10.2.4

### Patch Changes

- [`407f8e7`](https://github.com/tdeekens/flopflip/commit/407f8e7484ef25316d34f14f29b94c673ecd8aed) [#1235](https://github.com/tdeekens/flopflip/pull/1235) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps and migrate to TypeScript v4

* [`407f8e7`](https://github.com/tdeekens/flopflip/commit/407f8e7484ef25316d34f14f29b94c673ecd8aed) [#1235](https://github.com/tdeekens/flopflip/pull/1235) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

* Updated dependencies [[`407f8e7`](https://github.com/tdeekens/flopflip/commit/407f8e7484ef25316d34f14f29b94c673ecd8aed), [`407f8e7`](https://github.com/tdeekens/flopflip/commit/407f8e7484ef25316d34f14f29b94c673ecd8aed)]:
  - @flopflip/react@9.1.18
  - @flopflip/types@2.5.7

## 10.2.3

### Patch Changes

- Updated dependencies [[`6034a1c`](https://github.com/tdeekens/flopflip/commit/6034a1c8ff2c166f3fabee1deac86cf6262edde3)]:
  - @flopflip/types@2.5.6

## 10.2.2

### Patch Changes

- [`b4dd923`](https://github.com/tdeekens/flopflip/commit/b4dd92356208ffe1feefea0a86f7c05d738fcabb) [#1208](https://github.com/tdeekens/flopflip/pull/1208) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: types dependency

- Updated dependencies [[`b4dd923`](https://github.com/tdeekens/flopflip/commit/b4dd92356208ffe1feefea0a86f7c05d738fcabb)]:
  - @flopflip/react@9.1.17

## 10.2.1

### Patch Changes

- [`76354f8`](https://github.com/tdeekens/flopflip/commit/76354f8bd034b0ece14374b5eddf39858f75c7a7) [#1143](https://github.com/tdeekens/flopflip/pull/1143) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

- Updated dependencies [[`76354f8`](https://github.com/tdeekens/flopflip/commit/76354f8bd034b0ece14374b5eddf39858f75c7a7)]:
  - @flopflip/react@9.1.16
  - @flopflip/types@2.5.4

## 10.2.0

### Minor Changes

- [`bafdc4b`](https://github.com/tdeekens/flopflip/commit/bafdc4b27ace4c5490487b22f5f4ee3a5ce32ebf) [#1110](https://github.com/tdeekens/flopflip/pull/1110) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: add use-flag-variations

  You can use evaluate multiple flag variations at the same time:

  ```js
  const [variation1, variation2] = useFlagVariations([
    FLAG.VARIATION_A,
    FLAG.VARIATION_B,
  ]);
  ```

  Is the same as:

  ```js
  const variation1 = useFlagVariation(FLAG.VARIATION_A);
  const variation2 = useFlagVariation(FLAG.VARIATION_B);
  ```

* [`8ce10a9`](https://github.com/tdeekens/flopflip/commit/8ce10a953e54bb9e159f606338d327f0a3ede8fb) [#1106](https://github.com/tdeekens/flopflip/pull/1106) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: add use-flag-variation hook

  You can now conveniently a flag variation without evaluating its actual state (as with `useFeatureToggle`).

  ```js
  const variation = useFlagVariation('myFlagName');

  const isAEnabled = variation === VARIATION_A;
  const isBEnabled = variation === VARIATION_B;

  // Is the same as

  const isAEnabled = useFlagVariation('myFlagName', VARIATION_A);
  const isBEnabled = useFlagVariation('myFlagName', VARIATION_B);
  ```

  Using `useFlagVariation` is often a bit more concise if you want to work with the variation value yourself.

### Patch Changes

- Updated dependencies [[`bafdc4b`](https://github.com/tdeekens/flopflip/commit/bafdc4b27ace4c5490487b22f5f4ee3a5ce32ebf), [`8ce10a9`](https://github.com/tdeekens/flopflip/commit/8ce10a953e54bb9e159f606338d327f0a3ede8fb)]:
  - @flopflip/react@9.1.15

## 10.1.16

### Patch Changes

- [`32cc6a8`](https://github.com/tdeekens/flopflip/commit/32cc6a823ff9812ab2f256b69dd3f46e273feb5e) [#1102](https://github.com/tdeekens/flopflip/pull/1102) Thanks [@tdeekens](https://github.com/tdeekens)! - Update dependencies (TypeScript 3.9)

- Updated dependencies [[`32cc6a8`](https://github.com/tdeekens/flopflip/commit/32cc6a823ff9812ab2f256b69dd3f46e273feb5e)]:
  - @flopflip/react@9.1.14
  - @flopflip/types@2.5.3

## 10.1.15

### Patch Changes

- [`ee96512`](https://github.com/tdeekens/flopflip/commit/ee96512dd32ab75e6f9790df9322d6bc27642eac) [#1089](https://github.com/tdeekens/flopflip/pull/1089) Thanks [@tdeekens](https://github.com/tdeekens)! - Updating dependencies.

- Updated dependencies [[`ee96512`](https://github.com/tdeekens/flopflip/commit/ee96512dd32ab75e6f9790df9322d6bc27642eac)]:
  - @flopflip/react@9.1.13
