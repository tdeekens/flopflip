# @flopflip/react-redux

## 12.1.0

### Minor Changes

- [`57c90be`](https://github.com/tdeekens/flopflip/commit/57c90be8517cea797b0d89ece686cd66cd65e38e) [#1374](https://github.com/tdeekens/flopflip/pull/1374) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: add support for number json variations

  Prior to this `@flopflip` supported `sttring` or `boolean` variations. With it it also supports JSON variations (as LaunchDarkly calls them). For `@flopflip` these variations are of type `Record<string, unknown>` or `unknown[]`. In the future we might allow passing in a generic to narrow down the type.

### Patch Changes

- Updated dependencies [[`57c90be`](https://github.com/tdeekens/flopflip/commit/57c90be8517cea797b0d89ece686cd66cd65e38e)]:
  - @flopflip/react@11.1.0
  - @flopflip/types@4.1.0

## 12.0.1

### Patch Changes

- Updated dependencies [[`e9b47fd`](https://github.com/tdeekens/flopflip/commit/e9b47fd613452d5ec5d3bf7af1dcc1cc2d9c11a7)]:
  - @flopflip/types@4.0.1
  - @flopflip/react@11.0.1

## 12.0.0

### Major Changes

- [`3d2a174`](https://github.com/tdeekens/flopflip/commit/3d2a1742f9e6c99ba0360e8f33de6ce077fbd404) [#1367](https://github.com/tdeekens/flopflip/pull/1367) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: allow adapters to affect each others state

  An adapter can now have an `effectIds` besides its own `id`. This allows one adapter to effect other adapters state. In turn allowing flopflip to theoretically support multiple adapters.

* [`41d403e`](https://github.com/tdeekens/flopflip/commit/41d403eb74afbbc3b703a529ccf0c40150964e9a) [#1366](https://github.com/tdeekens/flopflip/pull/1366) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: adapters to have own state slice

  The `react-redux` package has one potential breaking change. If you used `selectFlags` and/or or `selectFlag` directly then you will have to use their new signature.

  ```diff
  -useSelector(selectFlags);
  +useSelector(selectFlags());
  ```

  ```diff
  -useSelector(selectFlag('fooFlag');
  +useSelector(selectFlag([adapter.id], 'fooFlag'));
  ```

  In the second example `memory` could be `id` of your adapter. In the future we plan to support multiple adapters resulting in an array being passed.

  Note that in other locations, e.g. with `useFeatureToggle` we now which adapter you are using as we retrive it from the adapter context.

### Patch Changes

- [`b099b51`](https://github.com/tdeekens/flopflip/commit/b099b5175aebc472281ef40f3d67c5cb298d1be9) [#1362](https://github.com/tdeekens/flopflip/pull/1362) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: updateFlags to be only on adapter

  The `updateFlags` export from each adapter is no longer present. Please use the `adapter.updateFlags` function instead. The prior was a re-export of the latter for longer anyway.

  This affects also other locations you should hopefully not be affected by:

  1. `test-utils`: does not export `updateFlags` anymore. Use `adapter.updateFlags`
  2. Globals: The globals on the window do not contain a `window.__flopflip__.[id].updateFlags` anymore

* [`b9c74ed`](https://github.com/tdeekens/flopflip/commit/b9c74ed24b5e695c914b8c82a3a81926558b78f7) [#1365](https://github.com/tdeekens/flopflip/pull/1365) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: adapters and system to receive ids

- [`1e34552`](https://github.com/tdeekens/flopflip/commit/1e345527629b27bd0fba65b4006a7e3d5537fd9c) [#1368](https://github.com/tdeekens/flopflip/pull/1368) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: to use record with unknown over object

* [`981075d`](https://github.com/tdeekens/flopflip/commit/981075dbf4b293e44102205c594b39ffad31188d) [#1364](https://github.com/tdeekens/flopflip/pull/1364) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: to change import \* style

- [`feddd2c`](https://github.com/tdeekens/flopflip/commit/feddd2cbfa8e41d372f79dc214e14f250c114f97) [#1358](https://github.com/tdeekens/flopflip/pull/1358) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: clean up deps

- Updated dependencies [[`521660c`](https://github.com/tdeekens/flopflip/commit/521660c2452628e336896300fd1ab743cf6a4b12), [`b099b51`](https://github.com/tdeekens/flopflip/commit/b099b5175aebc472281ef40f3d67c5cb298d1be9), [`3d2a174`](https://github.com/tdeekens/flopflip/commit/3d2a1742f9e6c99ba0360e8f33de6ce077fbd404), [`b9c74ed`](https://github.com/tdeekens/flopflip/commit/b9c74ed24b5e695c914b8c82a3a81926558b78f7), [`1e34552`](https://github.com/tdeekens/flopflip/commit/1e345527629b27bd0fba65b4006a7e3d5537fd9c), [`ea542f5`](https://github.com/tdeekens/flopflip/commit/ea542f5174c3094f7af444caed788f17942bcf38), [`339a427`](https://github.com/tdeekens/flopflip/commit/339a42745a7131ee18aaa27d196a0cdc4207ee88), [`4c1d86b`](https://github.com/tdeekens/flopflip/commit/4c1d86be23e0c0f50b07191e6984db4fd4b0139c), [`41d403e`](https://github.com/tdeekens/flopflip/commit/41d403eb74afbbc3b703a529ccf0c40150964e9a), [`981075d`](https://github.com/tdeekens/flopflip/commit/981075dbf4b293e44102205c594b39ffad31188d), [`feddd2c`](https://github.com/tdeekens/flopflip/commit/feddd2cbfa8e41d372f79dc214e14f250c114f97)]:
  - @flopflip/react@11.0.0
  - @flopflip/types@4.0.0

## 11.0.13

### Patch Changes

- [`f288170`](https://github.com/tdeekens/flopflip/commit/f2881702bcaf39029d78faf5d89d7bf645096310) [#1355](https://github.com/tdeekens/flopflip/pull/1355) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

* [`5e825b9`](https://github.com/tdeekens/flopflip/commit/5e825b96aee89a325e16a11ee8e3f4b68c9f8f56) [#1351](https://github.com/tdeekens/flopflip/pull/1351) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: typo of selector for adapter context

- [`18bd598`](https://github.com/tdeekens/flopflip/commit/18bd598f78891bcc24901f8c916c38f55d80e445) [#1349](https://github.com/tdeekens/flopflip/pull/1349) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: remove unused read-pkg-\* dependencies

* [`cbacd83`](https://github.com/tdeekens/flopflip/commit/cbacd836dd9d9411043efb9ad4795d75ed520d83) [#1352](https://github.com/tdeekens/flopflip/pull/1352) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: to use explicit React imports

* Updated dependencies [[`f288170`](https://github.com/tdeekens/flopflip/commit/f2881702bcaf39029d78faf5d89d7bf645096310), [`5e825b9`](https://github.com/tdeekens/flopflip/commit/5e825b96aee89a325e16a11ee8e3f4b68c9f8f56), [`d72a4cd`](https://github.com/tdeekens/flopflip/commit/d72a4cd013295fa15478212d56840c6c4dd2c9df), [`33b3216`](https://github.com/tdeekens/flopflip/commit/33b3216f227969f8a5ce0670b9590e5e06243fea), [`18bd598`](https://github.com/tdeekens/flopflip/commit/18bd598f78891bcc24901f8c916c38f55d80e445), [`cbacd83`](https://github.com/tdeekens/flopflip/commit/cbacd836dd9d9411043efb9ad4795d75ed520d83)]:
  - @flopflip/react@10.0.14
  - @flopflip/types@3.1.0

## 11.0.12

### Patch Changes

- [`cf47e40`](https://github.com/tdeekens/flopflip/commit/cf47e407bd55c8f9582dbce542010b6f9f6b8a45) [#1345](https://github.com/tdeekens/flopflip/pull/1345) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

- Updated dependencies [[`cf47e40`](https://github.com/tdeekens/flopflip/commit/cf47e407bd55c8f9582dbce542010b6f9f6b8a45)]:
  - @flopflip/react@10.0.13

## 11.0.11

### Patch Changes

- Updated dependencies [[`9ba0922`](https://github.com/tdeekens/flopflip/commit/9ba0922651198b4cb53f4c3f71e358bdfb1fa4ae)]:
  - @flopflip/types@3.0.11
  - @flopflip/react@10.0.11

## 11.0.10

### Patch Changes

- Updated dependencies [[`5d2376b`](https://github.com/tdeekens/flopflip/commit/5d2376b6491761cd5e11cbe979d318e1d307c7ef)]:
  - @flopflip/types@3.0.10
  - @flopflip/react@10.0.10

## 11.0.9

### Patch Changes

- Updated dependencies [[`e927867`](https://github.com/tdeekens/flopflip/commit/e92786784675656a79d6866bbeb6797683dcf71e)]:
  - @flopflip/types@3.0.9
  - @flopflip/react@10.0.9

## 11.0.8

### Patch Changes

- Updated dependencies [[`a25c329`](https://github.com/tdeekens/flopflip/commit/a25c32916caec291d7f949270398e7f4c19ea2a4)]:
  - @flopflip/types@3.0.8
  - @flopflip/react@10.0.8

## 11.0.7

### Patch Changes

- [`1e559be`](https://github.com/tdeekens/flopflip/commit/1e559bef1170439f6504997a5e2f9b6f6e971230) [#1331](https://github.com/tdeekens/flopflip/pull/1331) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: to remove type essentials

- Updated dependencies [[`1e559be`](https://github.com/tdeekens/flopflip/commit/1e559bef1170439f6504997a5e2f9b6f6e971230)]:
  - @flopflip/react@10.0.7
  - @flopflip/types@3.0.7

## 11.0.6

### Patch Changes

- [`23b4e4d`](https://github.com/tdeekens/flopflip/commit/23b4e4dd2713e7aff2062cba60bf0251692f78ad) [#1329](https://github.com/tdeekens/flopflip/pull/1329) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: to simplify types of configure

- Updated dependencies [[`23b4e4d`](https://github.com/tdeekens/flopflip/commit/23b4e4dd2713e7aff2062cba60bf0251692f78ad)]:
  - @flopflip/react@10.0.6
  - @flopflip/types@3.0.6

## 11.0.5

### Patch Changes

- [`40e212f`](https://github.com/tdeekens/flopflip/commit/40e212fba6328d6bf2f9a5f2494a4b0f6ec1b811) Thanks [@tdeekens](https://github.com/tdeekens)! - regenerate yarn.lock

- Updated dependencies [[`40e212f`](https://github.com/tdeekens/flopflip/commit/40e212fba6328d6bf2f9a5f2494a4b0f6ec1b811)]:
  - @flopflip/react@10.0.5
  - @flopflip/types@3.0.5

## 11.0.4

### Patch Changes

- [`787b265`](https://github.com/tdeekens/flopflip/commit/787b26580f7fa973e17065c11898dada0201e9e4) [#1325](https://github.com/tdeekens/flopflip/pull/1325) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

- Updated dependencies [[`787b265`](https://github.com/tdeekens/flopflip/commit/787b26580f7fa973e17065c11898dada0201e9e4)]:
  - @flopflip/react@10.0.4
  - @flopflip/types@3.0.4

## 11.0.3

### Patch Changes

- [`fb8d122`](https://github.com/tdeekens/flopflip/commit/fb8d12285062e0af4a9e66f6e5d7d1e9196a0ac2) [#1323](https://github.com/tdeekens/flopflip/pull/1323) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: to not infer returns

- Updated dependencies [[`fb8d122`](https://github.com/tdeekens/flopflip/commit/fb8d12285062e0af4a9e66f6e5d7d1e9196a0ac2)]:
  - @flopflip/react@10.0.3
  - @flopflip/types@3.0.3

## 11.0.2

### Patch Changes

- [`853b28d`](https://github.com/tdeekens/flopflip/commit/853b28d0d964f9cc897198d463e494881a82efcc) [#1321](https://github.com/tdeekens/flopflip/pull/1321) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: to not use typings on any package

- Updated dependencies [[`853b28d`](https://github.com/tdeekens/flopflip/commit/853b28d0d964f9cc897198d463e494881a82efcc)]:
  - @flopflip/react@10.0.2
  - @flopflip/types@3.0.2

## 11.0.1

### Patch Changes

- [`ad5935f`](https://github.com/tdeekens/flopflip/commit/ad5935fe1d355dbd244f97f78e74fbe0e2a8a3f3) [#1320](https://github.com/tdeekens/flopflip/pull/1320) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

* [`f0e8c66`](https://github.com/tdeekens/flopflip/commit/f0e8c66f008b1f6a959f463e01008844ee70d405) [#1314](https://github.com/tdeekens/flopflip/pull/1314) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: to use preconstruct cli

  This swaps out our complete build tooling to embrase a more focussed approach.

  This should not create issues as all entry points have been migrated.

* Updated dependencies [[`ad5935f`](https://github.com/tdeekens/flopflip/commit/ad5935fe1d355dbd244f97f78e74fbe0e2a8a3f3), [`f0e8c66`](https://github.com/tdeekens/flopflip/commit/f0e8c66f008b1f6a959f463e01008844ee70d405)]:
  - @flopflip/react@10.0.1
  - @flopflip/types@3.0.1

## 11.0.0

### Major Changes

- [`891fb29`](https://github.com/tdeekens/flopflip/commit/891fb294d5d6e016224b5a16d22760f0a55f9606) [#1287](https://github.com/tdeekens/flopflip/pull/1287) Thanks [@renovate](https://github.com/apps/renovate)! - flopflip is now built with TypeScript v4 which can cause compatibility issues if you project runs on an older version of TypeScript

### Patch Changes

- Updated dependencies [[`891fb29`](https://github.com/tdeekens/flopflip/commit/891fb294d5d6e016224b5a16d22760f0a55f9606)]:
  - @flopflip/react@10.0.0
  - @flopflip/types@3.0.0

## 10.2.8

### Patch Changes

- [`5598832`](https://github.com/tdeekens/flopflip/commit/5598832df710f707fe0832cd4011e26c060e24a8) [#1275](https://github.com/tdeekens/flopflip/pull/1275) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

- Updated dependencies [[`5598832`](https://github.com/tdeekens/flopflip/commit/5598832df710f707fe0832cd4011e26c060e24a8)]:
  - @flopflip/react@9.1.20

## 10.2.7

### Patch Changes

- [`eac3bd4`](https://github.com/tdeekens/flopflip/commit/eac3bd4d80fee4209ed39d7b9199916afb7f192f) [#1269](https://github.com/tdeekens/flopflip/pull/1269) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update dependencies across packages

- Updated dependencies [[`eac3bd4`](https://github.com/tdeekens/flopflip/commit/eac3bd4d80fee4209ed39d7b9199916afb7f192f)]:
  - @flopflip/react@9.1.19
  - @flopflip/types@2.5.10

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
