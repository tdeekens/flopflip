# @flopflip/launchdarkly-adapter

## 5.0.6

### Patch Changes

- Updated dependencies [[`fbc9bce`](https://github.com/tdeekens/flopflip/commit/fbc9bce3281b88e8fe81330cd442409b18b5162b)]:
  - @flopflip/types@4.1.8
  - @flopflip/adapter-utilities@1.0.10

## 5.0.5

### Patch Changes

- [`e12bda8`](https://github.com/tdeekens/flopflip/commit/e12bda837d42b3a516f47bfe9241162668fa9963) [#1393](https://github.com/tdeekens/flopflip/pull/1393) Thanks [@tdeekens](https://github.com/tdeekens)! - update dependencies

- Updated dependencies [[`e12bda8`](https://github.com/tdeekens/flopflip/commit/e12bda837d42b3a516f47bfe9241162668fa9963)]:
  - @flopflip/adapter-utilities@1.0.9
  - @flopflip/types@4.1.7

## 5.0.4

### Patch Changes

- Updated dependencies [[`dfc1463`](https://github.com/tdeekens/flopflip/commit/dfc146387052c05697353e36c18285df37c0a87f)]:
  - @flopflip/types@4.1.6
  - @flopflip/adapter-utilities@1.0.8

## 5.0.3

### Patch Changes

- Updated dependencies [[`8fd148b`](https://github.com/tdeekens/flopflip/commit/8fd148b724394887e99ed9136bb309776a2fc375)]:
  - @flopflip/types@4.1.5
  - @flopflip/adapter-utilities@1.0.7

## 5.0.2

### Patch Changes

- Updated dependencies [[`d203f38`](https://github.com/tdeekens/flopflip/commit/d203f382100d681f8699e7c6f3b82dd8ad8ab257)]:
  - @flopflip/types@4.1.4
  - @flopflip/adapter-utilities@1.0.6

## 5.0.1

### Patch Changes

- [`498f3bc`](https://github.com/tdeekens/flopflip/commit/498f3bcdc605f60bd8e72924cdef08c4a079d4f1) [#1380](https://github.com/tdeekens/flopflip/pull/1380) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: to type TUser to be generic

* [`92ebba8`](https://github.com/tdeekens/flopflip/commit/92ebba83bdf1fb876ad830db124c306de6f5c86d) [#1382](https://github.com/tdeekens/flopflip/pull/1382) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: add manypkg for validation for workspaces

* Updated dependencies [[`498f3bc`](https://github.com/tdeekens/flopflip/commit/498f3bcdc605f60bd8e72924cdef08c4a079d4f1), [`92ebba8`](https://github.com/tdeekens/flopflip/commit/92ebba83bdf1fb876ad830db124c306de6f5c86d)]:
  - @flopflip/types@4.1.3
  - @flopflip/adapter-utilities@1.0.5

## 5.0.0

### Major Changes

- [`0fbcac4`](https://github.com/tdeekens/flopflip/commit/0fbcac4d42568dda5fad6f1e33ff605b954301ee) [#1378](https://github.com/tdeekens/flopflip/pull/1378) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor(adapters): to split out sdk options

  This release splits the `adapterArgs` or adapters which use an underlying SDK. Prior `adapterArgs` bound to `@flopflip`'s adapter and the underlying SDK (e.g. by LauncDarkly) were mixed.

  This release introduces a new `sdk` field on the `adapterArgs` which contain only fields forwarded to an underlying SDK. This also allows the nested `adapterConfiguration` field to become top-level as it is bound to the adapter.

  In essenence: `adapterConfiguration` is now directly flat out on `adapterArgs` while any SDK fields are nested into the `sdk` field.

  **splitio-adapter**

  - `sdk.authorizationKey`: Authorization key for splitio
  - `sdk.options`: General attributes passed to splitio SDK
  - `sdk.treatmentAttributes`: The treatment attributes passed to splitio

  Over `adapterArgs.{authorizationKey, options, treatmentAttributes}`

  **launchdarkly-adapter**

  - `sdk.clientSideId`
  - `sdk.clientOptions`

  Over `adapterArgs.{clientSideId, clientOptions}`.

  **graphql-adapter**

  All fields are now top-level not under `adapterConfiguration`

  **localstorage-adapter**

  All fields are now top-level not under `adapterConfiguration` while it is now `pollingInteralMs` not `pollingInteral`.

### Patch Changes

- Updated dependencies [[`0fbcac4`](https://github.com/tdeekens/flopflip/commit/0fbcac4d42568dda5fad6f1e33ff605b954301ee)]:
  - @flopflip/types@4.1.2
  - @flopflip/adapter-utilities@1.0.4

## 4.0.3

### Patch Changes

- Updated dependencies [[`badd563`](https://github.com/tdeekens/flopflip/commit/badd563fb90f0af3a0e364d4393a108c0b7ebec8)]:
  - @flopflip/types@4.1.1
  - @flopflip/adapter-utilities@1.0.3

## 4.0.2

### Patch Changes

- Updated dependencies [[`57c90be`](https://github.com/tdeekens/flopflip/commit/57c90be8517cea797b0d89ece686cd66cd65e38e)]:
  - @flopflip/types@4.1.0
  - @flopflip/adapter-utilities@1.0.2

## 4.0.1

### Patch Changes

- Updated dependencies [[`e9b47fd`](https://github.com/tdeekens/flopflip/commit/e9b47fd613452d5ec5d3bf7af1dcc1cc2d9c11a7)]:
  - @flopflip/types@4.0.1
  - @flopflip/adapter-utilities@1.0.1

## 4.0.0

### Major Changes

- [`521660c`](https://github.com/tdeekens/flopflip/commit/521660c2452628e336896300fd1ab743cf6a4b12) [#1363](https://github.com/tdeekens/flopflip/pull/1363) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: to remove isAdapterReady

  The deprecated `adapter.getIsReady` and FaaC of `isAdapterReady` is removed. Please now `adapter.getIsConfigured` and `isAdapterConfigured`.

* [`b099b51`](https://github.com/tdeekens/flopflip/commit/b099b5175aebc472281ef40f3d67c5cb298d1be9) [#1362](https://github.com/tdeekens/flopflip/pull/1362) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: updateFlags to be only on adapter

  The `updateFlags` export from each adapter is no longer present. Please use the `adapter.updateFlags` function instead. The prior was a re-export of the latter for longer anyway.

  This affects also other locations you should hopefully not be affected by:

  1. `test-utils`: does not export `updateFlags` anymore. Use `adapter.updateFlags`
  2. Globals: The globals on the window do not contain a `window.__flopflip__.[id].updateFlags` anymore

### Patch Changes

- [`3d2a174`](https://github.com/tdeekens/flopflip/commit/3d2a1742f9e6c99ba0360e8f33de6ce077fbd404) [#1367](https://github.com/tdeekens/flopflip/pull/1367) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: allow adapters to affect each others state

  An adapter can now have an `effectIds` besides its own `id`. This allows one adapter to effect other adapters state. In turn allowing flopflip to theoretically support multiple adapters.

* [`b9c74ed`](https://github.com/tdeekens/flopflip/commit/b9c74ed24b5e695c914b8c82a3a81926558b78f7) [#1365](https://github.com/tdeekens/flopflip/pull/1365) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: adapters and system to receive ids

- [`2310e35`](https://github.com/tdeekens/flopflip/commit/2310e356c2c9f81d68bc88b7aaf25442da100c57) [#1356](https://github.com/tdeekens/flopflip/pull/1356) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: add and use shared adapter utilities

* [`d11e3a0`](https://github.com/tdeekens/flopflip/commit/d11e3a0a660e1844debbd9719c9013644ba85c45) [#1370](https://github.com/tdeekens/flopflip/pull/1370) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: homogenize adapters

- [`339a427`](https://github.com/tdeekens/flopflip/commit/339a42745a7131ee18aaa27d196a0cdc4207ee88) [#1359](https://github.com/tdeekens/flopflip/pull/1359) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: expose helpers on adapter

* [`4c1d86b`](https://github.com/tdeekens/flopflip/commit/4c1d86be23e0c0f50b07191e6984db4fd4b0139c) [#1361](https://github.com/tdeekens/flopflip/pull/1361) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: adapters to use instance variables

  This is a large refactor which changes all adapters to use instance variables over properties on the modules. During this refactora a public and private class variables were used.

  This should be entirely backwards compatible but is quite a large change. Please report any issues you see.

* Updated dependencies [[`521660c`](https://github.com/tdeekens/flopflip/commit/521660c2452628e336896300fd1ab743cf6a4b12), [`b099b51`](https://github.com/tdeekens/flopflip/commit/b099b5175aebc472281ef40f3d67c5cb298d1be9), [`3d2a174`](https://github.com/tdeekens/flopflip/commit/3d2a1742f9e6c99ba0360e8f33de6ce077fbd404), [`b9c74ed`](https://github.com/tdeekens/flopflip/commit/b9c74ed24b5e695c914b8c82a3a81926558b78f7), [`2310e35`](https://github.com/tdeekens/flopflip/commit/2310e356c2c9f81d68bc88b7aaf25442da100c57), [`0aff3a2`](https://github.com/tdeekens/flopflip/commit/0aff3a21d4b6ac581db0e795d48fde9aa63b61bb), [`339a427`](https://github.com/tdeekens/flopflip/commit/339a42745a7131ee18aaa27d196a0cdc4207ee88), [`4c1d86b`](https://github.com/tdeekens/flopflip/commit/4c1d86be23e0c0f50b07191e6984db4fd4b0139c)]:
  - @flopflip/types@4.0.0
  - @flopflip/adapter-utilities@1.0.0

## 3.0.12

### Patch Changes

- [`18bd598`](https://github.com/tdeekens/flopflip/commit/18bd598f78891bcc24901f8c916c38f55d80e445) [#1349](https://github.com/tdeekens/flopflip/pull/1349) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: remove unused read-pkg-\* dependencies

- Updated dependencies [[`d72a4cd`](https://github.com/tdeekens/flopflip/commit/d72a4cd013295fa15478212d56840c6c4dd2c9df), [`33b3216`](https://github.com/tdeekens/flopflip/commit/33b3216f227969f8a5ce0670b9590e5e06243fea)]:
  - @flopflip/types@3.1.0

## 3.0.11

### Patch Changes

- Updated dependencies [[`9ba0922`](https://github.com/tdeekens/flopflip/commit/9ba0922651198b4cb53f4c3f71e358bdfb1fa4ae)]:
  - @flopflip/types@3.0.11

## 3.0.10

### Patch Changes

- Updated dependencies [[`5d2376b`](https://github.com/tdeekens/flopflip/commit/5d2376b6491761cd5e11cbe979d318e1d307c7ef)]:
  - @flopflip/types@3.0.10

## 3.0.9

### Patch Changes

- Updated dependencies [[`e927867`](https://github.com/tdeekens/flopflip/commit/e92786784675656a79d6866bbeb6797683dcf71e)]:
  - @flopflip/types@3.0.9

## 3.0.8

### Patch Changes

- Updated dependencies [[`a25c329`](https://github.com/tdeekens/flopflip/commit/a25c32916caec291d7f949270398e7f4c19ea2a4)]:
  - @flopflip/types@3.0.8

## 3.0.7

### Patch Changes

- [`1e559be`](https://github.com/tdeekens/flopflip/commit/1e559bef1170439f6504997a5e2f9b6f6e971230) [#1331](https://github.com/tdeekens/flopflip/pull/1331) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: to remove type essentials

- Updated dependencies [[`1e559be`](https://github.com/tdeekens/flopflip/commit/1e559bef1170439f6504997a5e2f9b6f6e971230)]:
  - @flopflip/types@3.0.7

## 3.0.6

### Patch Changes

- Updated dependencies [[`23b4e4d`](https://github.com/tdeekens/flopflip/commit/23b4e4dd2713e7aff2062cba60bf0251692f78ad)]:
  - @flopflip/types@3.0.6

## 3.0.5

### Patch Changes

- [`40e212f`](https://github.com/tdeekens/flopflip/commit/40e212fba6328d6bf2f9a5f2494a4b0f6ec1b811) Thanks [@tdeekens](https://github.com/tdeekens)! - regenerate yarn.lock

- Updated dependencies [[`40e212f`](https://github.com/tdeekens/flopflip/commit/40e212fba6328d6bf2f9a5f2494a4b0f6ec1b811)]:
  - @flopflip/types@3.0.5

## 3.0.4

### Patch Changes

- [`787b265`](https://github.com/tdeekens/flopflip/commit/787b26580f7fa973e17065c11898dada0201e9e4) [#1325](https://github.com/tdeekens/flopflip/pull/1325) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

- Updated dependencies [[`787b265`](https://github.com/tdeekens/flopflip/commit/787b26580f7fa973e17065c11898dada0201e9e4)]:
  - @flopflip/types@3.0.4

## 3.0.3

### Patch Changes

- [`fb8d122`](https://github.com/tdeekens/flopflip/commit/fb8d12285062e0af4a9e66f6e5d7d1e9196a0ac2) [#1323](https://github.com/tdeekens/flopflip/pull/1323) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: to not infer returns

- Updated dependencies [[`fb8d122`](https://github.com/tdeekens/flopflip/commit/fb8d12285062e0af4a9e66f6e5d7d1e9196a0ac2)]:
  - @flopflip/types@3.0.3

## 3.0.2

### Patch Changes

- [`853b28d`](https://github.com/tdeekens/flopflip/commit/853b28d0d964f9cc897198d463e494881a82efcc) [#1321](https://github.com/tdeekens/flopflip/pull/1321) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: to not use typings on any package

- Updated dependencies [[`853b28d`](https://github.com/tdeekens/flopflip/commit/853b28d0d964f9cc897198d463e494881a82efcc)]:
  - @flopflip/types@3.0.2

## 3.0.1

### Patch Changes

- [`ad5935f`](https://github.com/tdeekens/flopflip/commit/ad5935fe1d355dbd244f97f78e74fbe0e2a8a3f3) [#1320](https://github.com/tdeekens/flopflip/pull/1320) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

* [`f0e8c66`](https://github.com/tdeekens/flopflip/commit/f0e8c66f008b1f6a959f463e01008844ee70d405) [#1314](https://github.com/tdeekens/flopflip/pull/1314) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: to use preconstruct cli

  This swaps out our complete build tooling to embrase a more focussed approach.

  This should not create issues as all entry points have been migrated.

* Updated dependencies [[`f0e8c66`](https://github.com/tdeekens/flopflip/commit/f0e8c66f008b1f6a959f463e01008844ee70d405)]:
  - @flopflip/types@3.0.1

## 3.0.0

### Major Changes

- [`891fb29`](https://github.com/tdeekens/flopflip/commit/891fb294d5d6e016224b5a16d22760f0a55f9606) [#1287](https://github.com/tdeekens/flopflip/pull/1287) Thanks [@renovate](https://github.com/apps/renovate)! - flopflip is now built with TypeScript v4 which can cause compatibility issues if you project runs on an older version of TypeScript

### Patch Changes

- Updated dependencies [[`891fb29`](https://github.com/tdeekens/flopflip/commit/891fb294d5d6e016224b5a16d22760f0a55f9606)]:
  - @flopflip/types@3.0.0

## 2.15.7

### Patch Changes

- [`5598832`](https://github.com/tdeekens/flopflip/commit/5598832df710f707fe0832cd4011e26c060e24a8) [#1275](https://github.com/tdeekens/flopflip/pull/1275) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

## 2.15.6

### Patch Changes

- [`eac3bd4`](https://github.com/tdeekens/flopflip/commit/eac3bd4d80fee4209ed39d7b9199916afb7f192f) [#1269](https://github.com/tdeekens/flopflip/pull/1269) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update dependencies across packages

- Updated dependencies [[`eac3bd4`](https://github.com/tdeekens/flopflip/commit/eac3bd4d80fee4209ed39d7b9199916afb7f192f)]:
  - @flopflip/types@2.5.10

## 2.15.5

### Patch Changes

- Updated dependencies [[`8c97b10`](https://github.com/tdeekens/flopflip/commit/8c97b10ce7159e8769791834bf6d7a1b5aba37f3)]:
  - @flopflip/types@2.5.9

## 2.15.4

### Patch Changes

- Updated dependencies [[`651a0ac`](https://github.com/tdeekens/flopflip/commit/651a0ac187860c9511d7da0bbf7cde6f5a9bb5aa)]:
  - @flopflip/types@2.5.8

## 2.15.3

### Patch Changes

- [`407f8e7`](https://github.com/tdeekens/flopflip/commit/407f8e7484ef25316d34f14f29b94c673ecd8aed) [#1235](https://github.com/tdeekens/flopflip/pull/1235) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps and migrate to TypeScript v4

* [`407f8e7`](https://github.com/tdeekens/flopflip/commit/407f8e7484ef25316d34f14f29b94c673ecd8aed) [#1235](https://github.com/tdeekens/flopflip/pull/1235) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

* Updated dependencies [[`407f8e7`](https://github.com/tdeekens/flopflip/commit/407f8e7484ef25316d34f14f29b94c673ecd8aed)]:
  - @flopflip/types@2.5.7

## 2.15.2

### Patch Changes

- [`de8c944`](https://github.com/tdeekens/flopflip/commit/de8c944a76b5fb7185f4eccb70bb40920c3cccb0) [#1225](https://github.com/tdeekens/flopflip/pull/1225) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: to check subscription of flag upon initial sdk fetch

## 2.15.1

### Patch Changes

- [`6034a1c`](https://github.com/tdeekens/flopflip/commit/6034a1c8ff2c166f3fabee1deac86cf6262edde3) [#1214](https://github.com/tdeekens/flopflip/pull/1214) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor(cypress-plugin): type the global flopflip

- Updated dependencies [[`6034a1c`](https://github.com/tdeekens/flopflip/commit/6034a1c8ff2c166f3fabee1deac86cf6262edde3)]:
  - @flopflip/types@2.5.6

## 2.15.0

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

## 2.14.5

### Patch Changes

- [`b4dd923`](https://github.com/tdeekens/flopflip/commit/b4dd92356208ffe1feefea0a86f7c05d738fcabb) [#1208](https://github.com/tdeekens/flopflip/pull/1208) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: types dependency

## 2.14.4

### Patch Changes

- [`8f7e504`](https://github.com/tdeekens/flopflip/commit/8f7e504951cb2dcb6b86abaa4908d10314515860) [#1206](https://github.com/tdeekens/flopflip/pull/1206) Thanks [@tdeekens](https://github.com/tdeekens)! - feat(launchdarkly-adapter): add unsubcribe flag state

- Updated dependencies [[`8f7e504`](https://github.com/tdeekens/flopflip/commit/8f7e504951cb2dcb6b86abaa4908d10314515860)]:
  - @flopflip/types@2.5.5

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
