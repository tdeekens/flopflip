# @flopflip/types

## 13.2.3

## 13.2.2

### Patch Changes

- [#1857](https://github.com/tdeekens/flopflip/pull/1857) [`95e9bfd`](https://github.com/tdeekens/flopflip/commit/95e9bfd211e6cd40d1d355e415a8eed345446c8b) Thanks [@tdeekens](https://github.com/tdeekens)! - Allow caching flags in localstorage or sessionstorage in launchdarkly adapter.

- [#1852](https://github.com/tdeekens/flopflip/pull/1852) [`b90946f`](https://github.com/tdeekens/flopflip/commit/b90946f52d8f71bcd1ed2fcdbfbbea3ed0005fdf) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

## 13.2.1

## 13.2.0

### Patch Changes

- [#1846](https://github.com/tdeekens/flopflip/pull/1846) [`445ee19`](https://github.com/tdeekens/flopflip/commit/445ee199d6b0962945d67c0469352d737b8c5f93) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependencies

## 13.1.8

### Patch Changes

- [#1833](https://github.com/tdeekens/flopflip/pull/1833) [`7835be0`](https://github.com/tdeekens/flopflip/commit/7835be092b8fdb211b7dcabefc2d588356920484) Thanks [@renovate](https://github.com/apps/renovate)! - Updatge dependencies

- [#1838](https://github.com/tdeekens/flopflip/pull/1838) [`054eb0e`](https://github.com/tdeekens/flopflip/commit/054eb0eade09033d321bd02a4052d673a6669353) Thanks [@renovate](https://github.com/apps/renovate)! - Update ts-deepmerge to v7

## 13.1.7

### Patch Changes

- [#1829](https://github.com/tdeekens/flopflip/pull/1829) [`7bab836d`](https://github.com/tdeekens/flopflip/commit/7bab836d76134b139ba28b80064cdb1a974d4ca3) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

## 13.1.6

### Patch Changes

- [#1819](https://github.com/tdeekens/flopflip/pull/1819) [`bd713a41`](https://github.com/tdeekens/flopflip/commit/bd713a41e92da2e68a122f8eb1709f9bdfef9831) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- [#1827](https://github.com/tdeekens/flopflip/pull/1827) [`c99ee374`](https://github.com/tdeekens/flopflip/commit/c99ee374a432b01533330661487807617a6aab91) Thanks [@Jesse9009](https://github.com/Jesse9009)! - Fix to make flags arg optional in TLaunchDarklyAdapterArgs type definition.

## 13.1.5

### Patch Changes

- [#1815](https://github.com/tdeekens/flopflip/pull/1815) [`5bbe7bd1`](https://github.com/tdeekens/flopflip/commit/5bbe7bd1b118fcccf61439256f68ae2f3885360b) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

## 13.1.4

### Patch Changes

- [#1806](https://github.com/tdeekens/flopflip/pull/1806) [`2723f752`](https://github.com/tdeekens/flopflip/commit/2723f752a36260c61148de80c553c08c64aa2c57) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependencies

## 13.1.3

### Patch Changes

- [#1805](https://github.com/tdeekens/flopflip/pull/1805) [`0909a2f5`](https://github.com/tdeekens/flopflip/commit/0909a2f58a003157b3e212b37a6bf50bba6feafb) Thanks [@tdeekens](https://github.com/tdeekens)! - Migrate from yarn to pnpm.

## 13.1.2

## 13.1.1

## 13.1.0

### Patch Changes

- [#1796](https://github.com/tdeekens/flopflip/pull/1796) [`c5439254`](https://github.com/tdeekens/flopflip/commit/c54392541aa7413c3d1425fafb46b184c90f3872) Thanks [@tdeekens](https://github.com/tdeekens)! - Rename pollingInteralMs to pollingIntervalMs.

## 13.0.4

## 13.0.3

### Patch Changes

- [#1767](https://github.com/tdeekens/flopflip/pull/1767) [`c47dbbbc`](https://github.com/tdeekens/flopflip/commit/c47dbbbc15c93d85b3632e87aedfa9db88176487) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- [#1774](https://github.com/tdeekens/flopflip/pull/1774) [`fd66f538`](https://github.com/tdeekens/flopflip/commit/fd66f538640da02bdb6a3479a7a73135106cf142) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

## 13.0.2

## 13.0.1

## 13.0.0

### Major Changes

- [#1742](https://github.com/tdeekens/flopflip/pull/1742) [`3fc3012a`](https://github.com/tdeekens/flopflip/commit/3fc3012a5891cfeae1b4ba68859fd390a1e3201c) Thanks [@userContext,](https://github.com/userContext,)! - Refactor to support v3 of the LaunchDarkly JavaScript SDK. The offical migration guide can be found [here](https://docs.launchdarkly.com/sdk/client-side/javascript/migration-2-to-3).

  If you're using LaunchDarkly as your adapter, then the shape of the `adapterArgs` passed to `ConfigureFlopflip` has changed.

  Assuming you are currently only using a user context (please refer to LaunchDarkly's documentation for more) then your previous configuration was:

  ```jsx
  <ConfigureFlopFlip
    adapter={adapter}
    adapterArgs={{ sdk: { clientSideId }, user }}
  >
    <App />
  </ConfigureFlopFlip>
  ```

  You will have to replace `user` with `context`

  ```diff
  <ConfigureFlopFlip
    adapter={adapter}
  -  adapterArgs={{ sdk: { clientSideId }, user }}
  +  adapterArgs={{ sdk: { clientSideId }, context }}
  >
    <App />
  </ConfigureFlopFlip>;
  ```

  The `context` itself which previously was a `user` of for instance

  ```js
  const user = {
    key: user?.id,
    custom: {
       foo: 'bar'
    }
  },
  ```

  should now be

  ```js
  const context = {
    kind: 'user',
    key: user?.id,
    foo: 'bar'
  },
  ```

  Please note that if you previously used a large user object with a lot of different information you might want to think about splitting it. This is the main purpose of the change on LaunchDarkly's side.

  ```js
  const deviceContext = {
    kind: "device",
    type: "iPad",
    key: "device-key-123abc",
  };

  const userContext = {
    kind: "user",
    key: "user-key-123abc",
    name: "Sandy",
    role: "doctor",
  };

  const multiContext = {
    kind: "multi",

    device: deviceContext,
  };
  ```

## 12.5.6

### Patch Changes

- [#1733](https://github.com/tdeekens/flopflip/pull/1733) [`340bd768`](https://github.com/tdeekens/flopflip/commit/340bd76837bd248c46b3d56ff46ea1c4c408e3cf) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- [#1714](https://github.com/tdeekens/flopflip/pull/1714) [`2f15d324`](https://github.com/tdeekens/flopflip/commit/2f15d324d7c96e03ead380e15d14a7102d2359c9) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update dependency launchdarkly-js-client-sdk to v3

## 12.5.5

## 12.5.4

### Patch Changes

- [`da4e3075`](https://github.com/tdeekens/flopflip/commit/da4e307557f462af33f4e3f053600f9df3eb8da2) Thanks [@tdeekens](https://github.com/tdeekens)! - Add a GitHub release

## 12.5.3

### Patch Changes

- [`ac088ccf`](https://github.com/tdeekens/flopflip/commit/ac088ccf55c443fe7c920792539e70f92d7ae49e) Thanks [@tdeekens](https://github.com/tdeekens)! - Release for GitHub release

## 12.5.2

### Patch Changes

- [`63f2a54a`](https://github.com/tdeekens/flopflip/commit/63f2a54a4a62d43e49ead767ae2fe3a1cb56063e) Thanks [@tdeekens](https://github.com/tdeekens)! - Another attempt to fix the GitHub release tab

## 12.5.1

### Patch Changes

- [`eac3ea46`](https://github.com/tdeekens/flopflip/commit/eac3ea467ff2a41ecbf07d9f5f1a08b088b91c16) Thanks [@tdeekens](https://github.com/tdeekens)! - Fix release issue with updating release on GitHub

## 12.5.0

### Minor Changes

- [#1717](https://github.com/tdeekens/flopflip/pull/1717) [`c268ee5f`](https://github.com/tdeekens/flopflip/commit/c268ee5f66b318d044e385958247a7141d0f8cce) Thanks [@tdeekens](https://github.com/tdeekens)! - Versiong and release issue on path version.

## 12.4.0

## 12.3.8

### Patch Changes

- [#1707](https://github.com/tdeekens/flopflip/pull/1707) [`1db0d869`](https://github.com/tdeekens/flopflip/commit/1db0d8697c5739bf2768509a5d98796426f511f4) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

## 12.3.7

### Patch Changes

- [#1704](https://github.com/tdeekens/flopflip/pull/1704) [`7569eaf7`](https://github.com/tdeekens/flopflip/commit/7569eaf7679ba4575d3ab23974be3b286c9a46dc) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

## 12.3.6

### Patch Changes

- [#1692](https://github.com/tdeekens/flopflip/pull/1692) [`dda66af9`](https://github.com/tdeekens/flopflip/commit/dda66af9d27cd600f01f5a9eb0dae6d71b0a403b) Thanks [@tdeekens](https://github.com/tdeekens)! - Fixes an issue with previous release

## 4.1.28

### Patch Changes

- [#1688](https://github.com/tdeekens/flopflip/pull/1688) [`37c71527`](https://github.com/tdeekens/flopflip/commit/37c71527404f3b7389662c4488bf9390c51e2d1a) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependencies

## 4.1.27

### Patch Changes

- [#1677](https://github.com/tdeekens/flopflip/pull/1677) [`12a30d04`](https://github.com/tdeekens/flopflip/commit/12a30d04b64296171ac5de7fac964d98cf86452a) Thanks [@tdeekens](https://github.com/tdeekens)! - Update dependencies

## 4.1.26

### Patch Changes

- [#1661](https://github.com/tdeekens/flopflip/pull/1661) [`360a61c5`](https://github.com/tdeekens/flopflip/commit/360a61c57b0b7deb3d63538e04615b83e446e923) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

## 4.1.25

### Patch Changes

- [#1648](https://github.com/tdeekens/flopflip/pull/1648) [`75872793`](https://github.com/tdeekens/flopflip/commit/7587279337e5828ff1ba6b047725a165ad5df2db) Thanks [@renovate](https://github.com/apps/renovate)! - Update all dependencies

## 4.1.24

### Patch Changes

- [#1640](https://github.com/tdeekens/flopflip/pull/1640) [`9cac278c`](https://github.com/tdeekens/flopflip/commit/9cac278cced8377f0e759608afbd9db8fb4894ef) Thanks [@tdeekens](https://github.com/tdeekens)! - Update dependencies

## 4.1.23

### Patch Changes

- [#1625](https://github.com/tdeekens/flopflip/pull/1625) [`50d202af`](https://github.com/tdeekens/flopflip/commit/50d202af3379bc3c6e28e78f34c6a1506f241de9) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

## 4.1.22

### Patch Changes

- [#1612](https://github.com/tdeekens/flopflip/pull/1612) [`aea0a3aa`](https://github.com/tdeekens/flopflip/commit/aea0a3aaf0e3d53fa3dc18868f40f7a5650f4099) Thanks [@emmenko](https://github.com/emmenko)! - Bump version of all packages. The previous release didn't include all changes so we're forcing a new release.

## 4.1.21

### Patch Changes

- [#1604](https://github.com/tdeekens/flopflip/pull/1604) [`4f13cb85`](https://github.com/tdeekens/flopflip/commit/4f13cb85167d33e89d03aeaba2d991f2a9f0728c) Thanks [@tdeekens](https://github.com/tdeekens)! - Refactor to import fixes from pnpm migration to `main`

## 4.1.20

### Patch Changes

- [#1558](https://github.com/tdeekens/flopflip/pull/1558) [`3624d423`](https://github.com/tdeekens/flopflip/commit/3624d42357145a13432b74dceccb4ad1682c5509) Thanks [@tdeekens](https://github.com/tdeekens)! - Refactor to use TypeScript v4.5 feature of inline type imports

## 4.1.19

### Patch Changes

- [#1543](https://github.com/tdeekens/flopflip/pull/1543) [`5c02eb83`](https://github.com/tdeekens/flopflip/commit/5c02eb830a0019b326bb0510a5a15f62e5dfe348) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: to migrate to yarn#3

## 4.1.18

### Patch Changes

- [#1528](https://github.com/tdeekens/flopflip/pull/1528) [`fef83a93`](https://github.com/tdeekens/flopflip/commit/fef83a9303ce329b2f1e044b0b8e462d3554414f) Thanks [@renovate](https://github.com/apps/renovate)! - chore(deps): update all dependencies

## 4.1.17

### Patch Changes

- [`a14d3863`](https://github.com/tdeekens/flopflip/commit/a14d3863e97546da0ccd5877555eace3650f2a60) Thanks [@tdeekens](https://github.com/tdeekens)! - Publish all packages

## 4.1.16

### Patch Changes

- [#1469](https://github.com/tdeekens/flopflip/pull/1469) [`62168194`](https://github.com/tdeekens/flopflip/commit/62168194057adb8ef39c9634b4fb0d420a812414) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

## 4.1.15

### Patch Changes

- [#1464](https://github.com/tdeekens/flopflip/pull/1464) [`ef59e379`](https://github.com/tdeekens/flopflip/commit/ef59e379764bc04903ab6dc6b1e1ad42e7288b93) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

## 4.1.14

### Patch Changes

- [#1457](https://github.com/tdeekens/flopflip/pull/1457) [`fe4fdfc0`](https://github.com/tdeekens/flopflip/commit/fe4fdfc0c51de4364d6ad2e881947d77780faabf) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

## 4.1.13

### Patch Changes

- [#1438](https://github.com/tdeekens/flopflip/pull/1438) [`10f981f5`](https://github.com/tdeekens/flopflip/commit/10f981f556284c5908b2be0d792db007a4002256) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

## 4.1.12

### Patch Changes

- [`bc7b3f41`](https://github.com/tdeekens/flopflip/commit/bc7b3f413554c4b11ab52ecdc5983da348014885) [#1414](https://github.com/tdeekens/flopflip/pull/1414) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update dependencies and add eslint sorting of imports

## 4.1.11

### Patch Changes

- [`8707dfd8`](https://github.com/tdeekens/flopflip/commit/8707dfd8a34fd581a5e7db448bd3c635d79cfad0) [#1408](https://github.com/tdeekens/flopflip/pull/1408) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

## 4.1.10

### Patch Changes

- [`5461b6c`](https://github.com/tdeekens/flopflip/commit/5461b6c5746fe004aaff1a6a64be28be40522601) [#1400](https://github.com/tdeekens/flopflip/pull/1400) Thanks [@tdeekens](https://github.com/tdeekens)! - fix(combine-adapter): to assign effectIds

## 4.1.9

### Patch Changes

- [`780a527`](https://github.com/tdeekens/flopflip/commit/780a527f6a86395463b5de5fcf88937491dee805) [#1398](https://github.com/tdeekens/flopflip/pull/1398) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: return to be unknown over generic

## 4.1.8

### Patch Changes

- [`fbc9bce`](https://github.com/tdeekens/flopflip/commit/fbc9bce3281b88e8fe81330cd442409b18b5162b) [#1396](https://github.com/tdeekens/flopflip/pull/1396) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: return type of execute

## 4.1.7

### Patch Changes

- [`e12bda8`](https://github.com/tdeekens/flopflip/commit/e12bda837d42b3a516f47bfe9241162668fa9963) [#1393](https://github.com/tdeekens/flopflip/pull/1393) Thanks [@tdeekens](https://github.com/tdeekens)! - update dependencies

## 4.1.6

### Patch Changes

- [`dfc1463`](https://github.com/tdeekens/flopflip/commit/dfc146387052c05697353e36c18285df37c0a87f) [#1390](https://github.com/tdeekens/flopflip/pull/1390) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: to have different user type per adapter

## 4.1.5

### Patch Changes

- [`8fd148b`](https://github.com/tdeekens/flopflip/commit/8fd148b724394887e99ed9136bb309776a2fc375) [#1387](https://github.com/tdeekens/flopflip/pull/1387) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: types of parse flags

## 4.1.4

### Patch Changes

- [`d203f38`](https://github.com/tdeekens/flopflip/commit/d203f382100d681f8699e7c6f3b82dd8ad8ab257) [#1385](https://github.com/tdeekens/flopflip/pull/1385) Thanks [@tdeekens](https://github.com/tdeekens)! - fix: typing of combined adapter args

## 4.1.3

### Patch Changes

- [`498f3bc`](https://github.com/tdeekens/flopflip/commit/498f3bcdc605f60bd8e72924cdef08c4a079d4f1) [#1380](https://github.com/tdeekens/flopflip/pull/1380) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: to type TUser to be generic

* [`92ebba8`](https://github.com/tdeekens/flopflip/commit/92ebba83bdf1fb876ad830db124c306de6f5c86d) [#1382](https://github.com/tdeekens/flopflip/pull/1382) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: add manypkg for validation for workspaces

## 4.1.2

### Patch Changes

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

  All fields are now top-level not under `adapterConfiguration` while it is now `pollingIntervalMs` not `pollingInteral`.

## 4.1.1

### Patch Changes

- [`badd563`](https://github.com/tdeekens/flopflip/commit/badd563fb90f0af3a0e364d4393a108c0b7ebec8) [#1376](https://github.com/tdeekens/flopflip/pull/1376) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: to split out adapter args

## 4.1.0

### Minor Changes

- [`57c90be`](https://github.com/tdeekens/flopflip/commit/57c90be8517cea797b0d89ece686cd66cd65e38e) [#1374](https://github.com/tdeekens/flopflip/pull/1374) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: add support for number json variations

  Prior to this `@flopflip` supported `sttring` or `boolean` variations. With it it also supports JSON variations (as LaunchDarkly calls them). For `@flopflip` these variations are of type `Record<string, unknown>` or `unknown[]`. In the future we might allow passing in a generic to narrow down the type.

## 4.0.1

### Patch Changes

- [`e9b47fd`](https://github.com/tdeekens/flopflip/commit/e9b47fd613452d5ec5d3bf7af1dcc1cc2d9c11a7) [#1372](https://github.com/tdeekens/flopflip/pull/1372) Thanks [@tdeekens](https://github.com/tdeekens)! - fix(combine-adapters): improve typings

## 4.0.0

### Major Changes

- [`521660c`](https://github.com/tdeekens/flopflip/commit/521660c2452628e336896300fd1ab743cf6a4b12) [#1363](https://github.com/tdeekens/flopflip/pull/1363) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: to remove isAdapterReady

  The deprecated `adapter.getIsReady` and FaaC of `isAdapterReady` is removed. Please now `adapter.getIsConfigured` and `isAdapterConfigured`.

### Patch Changes

- [`3d2a174`](https://github.com/tdeekens/flopflip/commit/3d2a1742f9e6c99ba0360e8f33de6ce077fbd404) [#1367](https://github.com/tdeekens/flopflip/pull/1367) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: allow adapters to affect each others state

  An adapter can now have an `effectIds` besides its own `id`. This allows one adapter to effect other adapters state. In turn allowing flopflip to theoretically support multiple adapters.

* [`b9c74ed`](https://github.com/tdeekens/flopflip/commit/b9c74ed24b5e695c914b8c82a3a81926558b78f7) [#1365](https://github.com/tdeekens/flopflip/pull/1365) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: adapters and system to receive ids

- [`339a427`](https://github.com/tdeekens/flopflip/commit/339a42745a7131ee18aaa27d196a0cdc4207ee88) [#1359](https://github.com/tdeekens/flopflip/pull/1359) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: expose helpers on adapter

* [`4c1d86b`](https://github.com/tdeekens/flopflip/commit/4c1d86be23e0c0f50b07191e6984db4fd4b0139c) [#1361](https://github.com/tdeekens/flopflip/pull/1361) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: adapters to use instance variables

  This is a large refactor which changes all adapters to use instance variables over properties on the modules. During this refactora a public and private class variables were used.

  This should be entirely backwards compatible but is quite a large change. Please report any issues you see.

## 3.1.0

### Minor Changes

- [`d72a4cd`](https://github.com/tdeekens/flopflip/commit/d72a4cd013295fa15478212d56840c6c4dd2c9df) [#1354](https://github.com/tdeekens/flopflip/pull/1354) Thanks [@tdeekens](https://github.com/tdeekens)! - feat(graphql-adapter): add cache option

  This as a result is considered the initial v1 version of the adapter.

### Patch Changes

- [`33b3216`](https://github.com/tdeekens/flopflip/commit/33b3216f227969f8a5ce0670b9590e5e06243fea) [#1348](https://github.com/tdeekens/flopflip/pull/1348) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: to have localstorage-cache package

## 3.0.11

### Patch Changes

- [`9ba0922`](https://github.com/tdeekens/flopflip/commit/9ba0922651198b4cb53f4c3f71e358bdfb1fa4ae) [#1339](https://github.com/tdeekens/flopflip/pull/1339) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: add parsing of flags

## 3.0.10

### Patch Changes

- [`5d2376b`](https://github.com/tdeekens/flopflip/commit/5d2376b6491761cd5e11cbe979d318e1d307c7ef) [#1337](https://github.com/tdeekens/flopflip/pull/1337) Thanks [@tdeekens](https://github.com/tdeekens)! - feat: allow headers for adapter

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
