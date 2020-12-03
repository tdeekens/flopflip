# @flopflip/types

## 3.0.9

### Patch Changes

- [`e927867`](https://github.com/tdeekens/flopflip/commit/e92786784675656a79d6866bbeb6797683dcf71e) [#1335](https://github.com/tdeekens/flopflip/pull/1335) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

## 3.0.8

### Patch Changes

- [`a25c329`](https://github.com/tdeekens/flopflip/commit/a25c32916caec291d7f949270398e7f4c19ea2a4) [#1333](https://github.com/tdeekens/flopflip/pull/1333) Thanks [@tdeekens](https://github.com/tdeekens)! - feat(gtaphql-adapter): add graphql adapter

  A new `graphql-adapter` which should be considered beta was added.

  ```js
  import { ConfigureFlopFlip } from "@flopflip/react-broadcast";
  import adapter from "@flopflip/graphql-adapter";

  const adapterArgs = React.useMemo(() => {
     adapterConfiguration: {
        uri: 'https://domain.at/graphql'
        pollingInternal: 1000,
        query: gql`query AllFeatures { flags: allFeatures(id: $userId) { name value} }`,
        getVariables: (adapterArgs) => ({ userId: ardapterArgs.userId })
     },
     userId,
  })

  <ConfigureFlopFlip adapter={adapter} adapterArgs={adapterArgs}>
     <App />
  </ConfigureFlopFlip>;
  ```

## 3.0.7

### Patch Changes

- [`1e559be`](https://github.com/tdeekens/flopflip/commit/1e559bef1170439f6504997a5e2f9b6f6e971230) [#1331](https://github.com/tdeekens/flopflip/pull/1331) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: to remove type essentials

## 3.0.6

### Patch Changes

- [`23b4e4d`](https://github.com/tdeekens/flopflip/commit/23b4e4dd2713e7aff2062cba60bf0251692f78ad) [#1329](https://github.com/tdeekens/flopflip/pull/1329) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: to simplify types of configure

## 3.0.5

### Patch Changes

- [`40e212f`](https://github.com/tdeekens/flopflip/commit/40e212fba6328d6bf2f9a5f2494a4b0f6ec1b811) Thanks [@tdeekens](https://github.com/tdeekens)! - regenerate yarn.lock

## 3.0.4

### Patch Changes

- [`787b265`](https://github.com/tdeekens/flopflip/commit/787b26580f7fa973e17065c11898dada0201e9e4) [#1325](https://github.com/tdeekens/flopflip/pull/1325) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

## 3.0.3

### Patch Changes

- [`fb8d122`](https://github.com/tdeekens/flopflip/commit/fb8d12285062e0af4a9e66f6e5d7d1e9196a0ac2) [#1323](https://github.com/tdeekens/flopflip/pull/1323) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: to not infer returns

## 3.0.2

### Patch Changes

- [`853b28d`](https://github.com/tdeekens/flopflip/commit/853b28d0d964f9cc897198d463e494881a82efcc) [#1321](https://github.com/tdeekens/flopflip/pull/1321) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: to not use typings on any package

## 3.0.1

### Patch Changes

- [`f0e8c66`](https://github.com/tdeekens/flopflip/commit/f0e8c66f008b1f6a959f463e01008844ee70d405) [#1314](https://github.com/tdeekens/flopflip/pull/1314) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: to use preconstruct cli

  This swaps out our complete build tooling to embrase a more focussed approach.

  This should not create issues as all entry points have been migrated.

## 3.0.0

### Major Changes

- [`891fb29`](https://github.com/tdeekens/flopflip/commit/891fb294d5d6e016224b5a16d22760f0a55f9606) [#1287](https://github.com/tdeekens/flopflip/pull/1287) Thanks [@renovate](https://github.com/apps/renovate)! - flopflip is now built with TypeScript v4 which can cause compatibility issues if you project runs on an older version of TypeScript

## 2.5.10

### Patch Changes

- [`eac3bd4`](https://github.com/tdeekens/flopflip/commit/eac3bd4d80fee4209ed39d7b9199916afb7f192f) [#1269](https://github.com/tdeekens/flopflip/pull/1269) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update dependencies across packages

## 2.5.9

### Patch Changes

- [`8c97b10`](https://github.com/tdeekens/flopflip/commit/8c97b10ce7159e8769791834bf6d7a1b5aba37f3) [#1244](https://github.com/tdeekens/flopflip/pull/1244) Thanks [@tdeekens](https://github.com/tdeekens)! - Keep backwards compatibility with TypeScript v3

## 2.5.8

### Patch Changes

- [`651a0ac`](https://github.com/tdeekens/flopflip/commit/651a0ac187860c9511d7da0bbf7cde6f5a9bb5aa) [#1242](https://github.com/tdeekens/flopflip/pull/1242) Thanks [@emmenko](https://github.com/emmenko)! - Keep backwards compatibility with TypeScript v3

## 2.5.7

### Patch Changes

- [`407f8e7`](https://github.com/tdeekens/flopflip/commit/407f8e7484ef25316d34f14f29b94c673ecd8aed) [#1235](https://github.com/tdeekens/flopflip/pull/1235) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps and migrate to TypeScript v4

## 2.5.6

### Patch Changes

- [`6034a1c`](https://github.com/tdeekens/flopflip/commit/6034a1c8ff2c166f3fabee1deac86cf6262edde3) [#1214](https://github.com/tdeekens/flopflip/pull/1214) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor(cypress-plugin): type the global flopflip

## 2.5.5

### Patch Changes

- [`8f7e504`](https://github.com/tdeekens/flopflip/commit/8f7e504951cb2dcb6b86abaa4908d10314515860) [#1206](https://github.com/tdeekens/flopflip/pull/1206) Thanks [@tdeekens](https://github.com/tdeekens)! - feat(launchdarkly-adapter): add unsubcribe flag state

## 2.5.4

### Patch Changes

- [`76354f8`](https://github.com/tdeekens/flopflip/commit/76354f8bd034b0ece14374b5eddf39858f75c7a7) [#1143](https://github.com/tdeekens/flopflip/pull/1143) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

## 2.5.3

### Patch Changes

- [`32cc6a8`](https://github.com/tdeekens/flopflip/commit/32cc6a823ff9812ab2f256b69dd3f46e273feb5e) [#1102](https://github.com/tdeekens/flopflip/pull/1102) Thanks [@tdeekens](https://github.com/tdeekens)! - Update dependencies (TypeScript 3.9)
