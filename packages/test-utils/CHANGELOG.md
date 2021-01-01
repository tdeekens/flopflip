# @flopflip/test-utils

## 3.0.3

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@3.0.3

## 3.0.2

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@3.0.2

## 3.0.1

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@3.0.1

## 3.0.0

### Major Changes

- [`b099b51`](https://github.com/tdeekens/flopflip/commit/b099b5175aebc472281ef40f3d67c5cb298d1be9) [#1362](https://github.com/tdeekens/flopflip/pull/1362) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: updateFlags to be only on adapter

  The `updateFlags` export from each adapter is no longer present. Please use the `adapter.updateFlags` function instead. The prior was a re-export of the latter for longer anyway.

  This affects also other locations you should hopefully not be affected by:

  1. `test-utils`: does not export `updateFlags` anymore. Use `adapter.updateFlags`
  2. Globals: The globals on the window do not contain a `window.__flopflip__.[id].updateFlags` anymore

### Patch Changes

- Updated dependencies [[`521660c`](https://github.com/tdeekens/flopflip/commit/521660c2452628e336896300fd1ab743cf6a4b12), [`b099b51`](https://github.com/tdeekens/flopflip/commit/b099b5175aebc472281ef40f3d67c5cb298d1be9), [`3d2a174`](https://github.com/tdeekens/flopflip/commit/3d2a1742f9e6c99ba0360e8f33de6ce077fbd404), [`b9c74ed`](https://github.com/tdeekens/flopflip/commit/b9c74ed24b5e695c914b8c82a3a81926558b78f7), [`2310e35`](https://github.com/tdeekens/flopflip/commit/2310e356c2c9f81d68bc88b7aaf25442da100c57), [`d11e3a0`](https://github.com/tdeekens/flopflip/commit/d11e3a0a660e1844debbd9719c9013644ba85c45), [`339a427`](https://github.com/tdeekens/flopflip/commit/339a42745a7131ee18aaa27d196a0cdc4207ee88), [`4c1d86b`](https://github.com/tdeekens/flopflip/commit/4c1d86be23e0c0f50b07191e6984db4fd4b0139c)]:
  - @flopflip/memory-adapter@3.0.0

## 2.0.12

### Patch Changes

- [`f288170`](https://github.com/tdeekens/flopflip/commit/f2881702bcaf39029d78faf5d89d7bf645096310) [#1355](https://github.com/tdeekens/flopflip/pull/1355) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

* [`18bd598`](https://github.com/tdeekens/flopflip/commit/18bd598f78891bcc24901f8c916c38f55d80e445) [#1349](https://github.com/tdeekens/flopflip/pull/1349) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: remove unused read-pkg-\* dependencies

* Updated dependencies [[`f288170`](https://github.com/tdeekens/flopflip/commit/f2881702bcaf39029d78faf5d89d7bf645096310), [`18bd598`](https://github.com/tdeekens/flopflip/commit/18bd598f78891bcc24901f8c916c38f55d80e445)]:
  - @flopflip/memory-adapter@2.0.12

## 2.0.11

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@2.0.11

## 2.0.10

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@2.0.10

## 2.0.9

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@2.0.9

## 2.0.8

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@2.0.8

## 2.0.7

### Patch Changes

- Updated dependencies [[`1e559be`](https://github.com/tdeekens/flopflip/commit/1e559bef1170439f6504997a5e2f9b6f6e971230)]:
  - @flopflip/memory-adapter@2.0.7

## 2.0.6

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@2.0.6

## 2.0.5

### Patch Changes

- [`40e212f`](https://github.com/tdeekens/flopflip/commit/40e212fba6328d6bf2f9a5f2494a4b0f6ec1b811) Thanks [@tdeekens](https://github.com/tdeekens)! - regenerate yarn.lock

- Updated dependencies [[`40e212f`](https://github.com/tdeekens/flopflip/commit/40e212fba6328d6bf2f9a5f2494a4b0f6ec1b811)]:
  - @flopflip/memory-adapter@2.0.5

## 2.0.4

### Patch Changes

- Updated dependencies [[`787b265`](https://github.com/tdeekens/flopflip/commit/787b26580f7fa973e17065c11898dada0201e9e4)]:
  - @flopflip/memory-adapter@2.0.4

## 2.0.3

### Patch Changes

- Updated dependencies [[`fb8d122`](https://github.com/tdeekens/flopflip/commit/fb8d12285062e0af4a9e66f6e5d7d1e9196a0ac2)]:
  - @flopflip/memory-adapter@2.0.3

## 2.0.2

### Patch Changes

- Updated dependencies [[`853b28d`](https://github.com/tdeekens/flopflip/commit/853b28d0d964f9cc897198d463e494881a82efcc)]:
  - @flopflip/memory-adapter@2.0.2

## 2.0.1

### Patch Changes

- [`ad5935f`](https://github.com/tdeekens/flopflip/commit/ad5935fe1d355dbd244f97f78e74fbe0e2a8a3f3) [#1320](https://github.com/tdeekens/flopflip/pull/1320) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

- Updated dependencies [[`f0e8c66`](https://github.com/tdeekens/flopflip/commit/f0e8c66f008b1f6a959f463e01008844ee70d405)]:
  - @flopflip/memory-adapter@2.0.1

## 2.0.0

### Major Changes

- [`891fb29`](https://github.com/tdeekens/flopflip/commit/891fb294d5d6e016224b5a16d22760f0a55f9606) [#1287](https://github.com/tdeekens/flopflip/pull/1287) Thanks [@renovate](https://github.com/apps/renovate)! - flopflip is now built with TypeScript v4 which can cause compatibility issues if you project runs on an older version of TypeScript

## 1.1.19

### Patch Changes

- [`5598832`](https://github.com/tdeekens/flopflip/commit/5598832df710f707fe0832cd4011e26c060e24a8) [#1275](https://github.com/tdeekens/flopflip/pull/1275) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

## 1.1.18

### Patch Changes

- [`eac3bd4`](https://github.com/tdeekens/flopflip/commit/eac3bd4d80fee4209ed39d7b9199916afb7f192f) [#1269](https://github.com/tdeekens/flopflip/pull/1269) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update dependencies across packages

## 1.1.17

### Patch Changes

- [`407f8e7`](https://github.com/tdeekens/flopflip/commit/407f8e7484ef25316d34f14f29b94c673ecd8aed) [#1235](https://github.com/tdeekens/flopflip/pull/1235) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps and migrate to TypeScript v4

* [`407f8e7`](https://github.com/tdeekens/flopflip/commit/407f8e7484ef25316d34f14f29b94c673ecd8aed) [#1235](https://github.com/tdeekens/flopflip/pull/1235) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

- [`407f8e7`](https://github.com/tdeekens/flopflip/commit/407f8e7484ef25316d34f14f29b94c673ecd8aed) [#1235](https://github.com/tdeekens/flopflip/pull/1235) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

## 1.1.16

### Patch Changes

- [`76354f8`](https://github.com/tdeekens/flopflip/commit/76354f8bd034b0ece14374b5eddf39858f75c7a7) [#1143](https://github.com/tdeekens/flopflip/pull/1143) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

## 1.1.15

### Patch Changes

- [`32cc6a8`](https://github.com/tdeekens/flopflip/commit/32cc6a823ff9812ab2f256b69dd3f46e273feb5e) [#1102](https://github.com/tdeekens/flopflip/pull/1102) Thanks [@tdeekens](https://github.com/tdeekens)! - Update dependencies (TypeScript 3.9)

## 1.1.14

### Patch Changes

- [`ee96512`](https://github.com/tdeekens/flopflip/commit/ee96512dd32ab75e6f9790df9322d6bc27642eac) [#1089](https://github.com/tdeekens/flopflip/pull/1089) Thanks [@tdeekens](https://github.com/tdeekens)! - Updating dependencies.
