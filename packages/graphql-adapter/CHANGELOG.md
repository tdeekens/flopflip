# @flopflip/graphql-adapter

## 3.0.0

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
  - @flopflip/localstorage-cache@1.0.5
  - @flopflip/sessionstorage-cache@1.0.5

## 2.0.3

### Patch Changes

- Updated dependencies [[`badd563`](https://github.com/tdeekens/flopflip/commit/badd563fb90f0af3a0e364d4393a108c0b7ebec8)]:
  - @flopflip/types@4.1.1
  - @flopflip/adapter-utilities@1.0.3
  - @flopflip/localstorage-cache@1.0.4
  - @flopflip/sessionstorage-cache@1.0.4

## 2.0.2

### Patch Changes

- Updated dependencies [[`57c90be`](https://github.com/tdeekens/flopflip/commit/57c90be8517cea797b0d89ece686cd66cd65e38e)]:
  - @flopflip/types@4.1.0
  - @flopflip/adapter-utilities@1.0.2
  - @flopflip/localstorage-cache@1.0.3
  - @flopflip/sessionstorage-cache@1.0.3

## 2.0.1

### Patch Changes

- Updated dependencies [[`e9b47fd`](https://github.com/tdeekens/flopflip/commit/e9b47fd613452d5ec5d3bf7af1dcc1cc2d9c11a7)]:
  - @flopflip/types@4.0.1
  - @flopflip/adapter-utilities@1.0.1
  - @flopflip/localstorage-cache@1.0.2
  - @flopflip/sessionstorage-cache@1.0.2

## 2.0.0

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

- [`feddd2c`](https://github.com/tdeekens/flopflip/commit/feddd2cbfa8e41d372f79dc214e14f250c114f97) [#1358](https://github.com/tdeekens/flopflip/pull/1358) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: clean up deps

- Updated dependencies [[`521660c`](https://github.com/tdeekens/flopflip/commit/521660c2452628e336896300fd1ab743cf6a4b12), [`b099b51`](https://github.com/tdeekens/flopflip/commit/b099b5175aebc472281ef40f3d67c5cb298d1be9), [`3d2a174`](https://github.com/tdeekens/flopflip/commit/3d2a1742f9e6c99ba0360e8f33de6ce077fbd404), [`b9c74ed`](https://github.com/tdeekens/flopflip/commit/b9c74ed24b5e695c914b8c82a3a81926558b78f7), [`2310e35`](https://github.com/tdeekens/flopflip/commit/2310e356c2c9f81d68bc88b7aaf25442da100c57), [`0aff3a2`](https://github.com/tdeekens/flopflip/commit/0aff3a21d4b6ac581db0e795d48fde9aa63b61bb), [`339a427`](https://github.com/tdeekens/flopflip/commit/339a42745a7131ee18aaa27d196a0cdc4207ee88), [`4c1d86b`](https://github.com/tdeekens/flopflip/commit/4c1d86be23e0c0f50b07191e6984db4fd4b0139c)]:
  - @flopflip/types@4.0.0
  - @flopflip/adapter-utilities@1.0.0
  - @flopflip/localstorage-cache@1.0.1
  - @flopflip/sessionstorage-cache@1.0.1

## 1.0.0

### Major Changes

- [`d72a4cd`](https://github.com/tdeekens/flopflip/commit/d72a4cd013295fa15478212d56840c6c4dd2c9df) [#1354](https://github.com/tdeekens/flopflip/pull/1354) Thanks [@tdeekens](https://github.com/tdeekens)! - feat(graphql-adapter): add cache option

  This as a result is considered the initial v1 version of the adapter.

### Patch Changes

- [`18bd598`](https://github.com/tdeekens/flopflip/commit/18bd598f78891bcc24901f8c916c38f55d80e445) [#1349](https://github.com/tdeekens/flopflip/pull/1349) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: remove unused read-pkg-\* dependencies

- Updated dependencies [[`3f707fb`](https://github.com/tdeekens/flopflip/commit/3f707fbffb82ad35b7c883a732d42ebd4604009b), [`f288170`](https://github.com/tdeekens/flopflip/commit/f2881702bcaf39029d78faf5d89d7bf645096310), [`d72a4cd`](https://github.com/tdeekens/flopflip/commit/d72a4cd013295fa15478212d56840c6c4dd2c9df), [`33b3216`](https://github.com/tdeekens/flopflip/commit/33b3216f227969f8a5ce0670b9590e5e06243fea), [`18bd598`](https://github.com/tdeekens/flopflip/commit/18bd598f78891bcc24901f8c916c38f55d80e445)]:
  - @flopflip/sessionstorage-cache@1.0.0
  - @flopflip/localstorage-cache@1.0.0
  - @flopflip/types@3.1.0

## 0.0.4

### Patch Changes

- [`9ba0922`](https://github.com/tdeekens/flopflip/commit/9ba0922651198b4cb53f4c3f71e358bdfb1fa4ae) [#1339](https://github.com/tdeekens/flopflip/pull/1339) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: add parsing of flags

- Updated dependencies [[`9ba0922`](https://github.com/tdeekens/flopflip/commit/9ba0922651198b4cb53f4c3f71e358bdfb1fa4ae)]:
  - @flopflip/types@3.0.11

## 0.0.3

### Patch Changes

- [`5d2376b`](https://github.com/tdeekens/flopflip/commit/5d2376b6491761cd5e11cbe979d318e1d307c7ef) [#1337](https://github.com/tdeekens/flopflip/pull/1337) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: allow headers for adapter

- Updated dependencies [[`5d2376b`](https://github.com/tdeekens/flopflip/commit/5d2376b6491761cd5e11cbe979d318e1d307c7ef)]:
  - @flopflip/types@3.0.10

## 0.0.2

### Patch Changes

- [`e927867`](https://github.com/tdeekens/flopflip/commit/e92786784675656a79d6866bbeb6797683dcf71e) [#1335](https://github.com/tdeekens/flopflip/pull/1335) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

- Updated dependencies [[`e927867`](https://github.com/tdeekens/flopflip/commit/e92786784675656a79d6866bbeb6797683dcf71e)]:
  - @flopflip/types@3.0.9

## 0.0.1

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

- Updated dependencies [[`a25c329`](https://github.com/tdeekens/flopflip/commit/a25c32916caec291d7f949270398e7f4c19ea2a4)]:
  - @flopflip/types@3.0.8
