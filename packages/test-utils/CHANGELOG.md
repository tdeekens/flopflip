# @flopflip/test-utils

## 13.3.3

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@13.3.3

## 13.3.2

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@13.3.2

## 13.3.1

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@13.3.1

## 13.3.0

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@13.3.0

## 13.2.3

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@13.2.3

## 13.2.2

### Patch Changes

- [#1852](https://github.com/tdeekens/flopflip/pull/1852) [`b90946f`](https://github.com/tdeekens/flopflip/commit/b90946f52d8f71bcd1ed2fcdbfbbea3ed0005fdf) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies [[`b90946f`](https://github.com/tdeekens/flopflip/commit/b90946f52d8f71bcd1ed2fcdbfbbea3ed0005fdf)]:
  - @flopflip/memory-adapter@13.2.2

## 13.2.1

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@13.2.1

## 13.2.0

### Minor Changes

- [#1848](https://github.com/tdeekens/flopflip/pull/1848) [`2f75a14`](https://github.com/tdeekens/flopflip/commit/2f75a146bcf0c6145a7f625927b52ac767caece8) Thanks [@CarlosCortizasCT](https://github.com/CarlosCortizasCT)! - Included a new hook that allows a consumer to read all the flags configured in the FlopFlip context.

  Example:

  ```javascript
  import { useAllFeatureToggles } from "@flopflip/react-broadcast";

  const MyComponent = () => {
    const allFeatureToggles = useAllFeatureToggles();

    return (
      <div>
        {allFeatureToggles.map(({ featureName, featureValue }) => (
          <div key={id}>
            <span>Feature name: {featureName}</span>
            <span>Feature value: {featureValue}</span>
          </div>
        ))}
      </div>
    );
  };
  ```

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@13.2.0

## 13.1.8

### Patch Changes

- [#1833](https://github.com/tdeekens/flopflip/pull/1833) [`7835be0`](https://github.com/tdeekens/flopflip/commit/7835be092b8fdb211b7dcabefc2d588356920484) Thanks [@renovate](https://github.com/apps/renovate)! - Updatge dependencies

- [#1838](https://github.com/tdeekens/flopflip/pull/1838) [`054eb0e`](https://github.com/tdeekens/flopflip/commit/054eb0eade09033d321bd02a4052d673a6669353) Thanks [@renovate](https://github.com/apps/renovate)! - Update ts-deepmerge to v7

- Updated dependencies [[`7835be0`](https://github.com/tdeekens/flopflip/commit/7835be092b8fdb211b7dcabefc2d588356920484), [`054eb0e`](https://github.com/tdeekens/flopflip/commit/054eb0eade09033d321bd02a4052d673a6669353)]:
  - @flopflip/memory-adapter@13.1.8

## 13.1.7

### Patch Changes

- [#1829](https://github.com/tdeekens/flopflip/pull/1829) [`7bab836d`](https://github.com/tdeekens/flopflip/commit/7bab836d76134b139ba28b80064cdb1a974d4ca3) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies []:
  - @flopflip/memory-adapter@13.1.7

## 13.1.6

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@13.1.6

## 13.1.5

### Patch Changes

- [#1815](https://github.com/tdeekens/flopflip/pull/1815) [`5bbe7bd1`](https://github.com/tdeekens/flopflip/commit/5bbe7bd1b118fcccf61439256f68ae2f3885360b) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies [[`5bbe7bd1`](https://github.com/tdeekens/flopflip/commit/5bbe7bd1b118fcccf61439256f68ae2f3885360b)]:
  - @flopflip/memory-adapter@13.1.5

## 13.1.4

### Patch Changes

- [#1806](https://github.com/tdeekens/flopflip/pull/1806) [`2723f752`](https://github.com/tdeekens/flopflip/commit/2723f752a36260c61148de80c553c08c64aa2c57) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependencies

- Updated dependencies [[`2723f752`](https://github.com/tdeekens/flopflip/commit/2723f752a36260c61148de80c553c08c64aa2c57)]:
  - @flopflip/memory-adapter@13.1.4

## 13.1.3

### Patch Changes

- [#1805](https://github.com/tdeekens/flopflip/pull/1805) [`0909a2f5`](https://github.com/tdeekens/flopflip/commit/0909a2f58a003157b3e212b37a6bf50bba6feafb) Thanks [@tdeekens](https://github.com/tdeekens)! - Migrate from yarn to pnpm.

- Updated dependencies [[`0909a2f5`](https://github.com/tdeekens/flopflip/commit/0909a2f58a003157b3e212b37a6bf50bba6feafb)]:
  - @flopflip/memory-adapter@13.1.3

## 13.1.2

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@13.1.2

## 13.1.1

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@13.1.1

## 13.1.0

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@13.1.0

## 13.0.4

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@13.0.4

## 13.0.3

### Patch Changes

- [#1767](https://github.com/tdeekens/flopflip/pull/1767) [`c47dbbbc`](https://github.com/tdeekens/flopflip/commit/c47dbbbc15c93d85b3632e87aedfa9db88176487) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- [#1774](https://github.com/tdeekens/flopflip/pull/1774) [`fd66f538`](https://github.com/tdeekens/flopflip/commit/fd66f538640da02bdb6a3479a7a73135106cf142) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies [[`c47dbbbc`](https://github.com/tdeekens/flopflip/commit/c47dbbbc15c93d85b3632e87aedfa9db88176487), [`fd66f538`](https://github.com/tdeekens/flopflip/commit/fd66f538640da02bdb6a3479a7a73135106cf142)]:
  - @flopflip/memory-adapter@13.0.3

## 13.0.2

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@13.0.2

## 13.0.1

### Patch Changes

- Updated dependencies [[`8914921b`](https://github.com/tdeekens/flopflip/commit/8914921bf6cd4ddcaf3cf22563d142ae8f5a0cef)]:
  - @flopflip/memory-adapter@13.0.1

## 13.0.0

### Patch Changes

- Updated dependencies [[`d5a25758`](https://github.com/tdeekens/flopflip/commit/d5a2575881c023b2d81ae98c6e972859ae61205b)]:
  - @flopflip/memory-adapter@13.0.0

## 12.5.6

### Patch Changes

- [#1733](https://github.com/tdeekens/flopflip/pull/1733) [`340bd768`](https://github.com/tdeekens/flopflip/commit/340bd76837bd248c46b3d56ff46ea1c4c408e3cf) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies [[`163548bf`](https://github.com/tdeekens/flopflip/commit/163548bfbfbae6f7206e79879bc0414ae82b9275)]:
  - @flopflip/memory-adapter@12.5.6

## 12.5.5

### Patch Changes

- [#1723](https://github.com/tdeekens/flopflip/pull/1723) [`c89cbc5d`](https://github.com/tdeekens/flopflip/commit/c89cbc5d76a2420f58b312e7ca31d318375ffe39) Thanks [@renovate](https://github.com/apps/renovate)! - Update all dependencies

- Updated dependencies [[`c89cbc5d`](https://github.com/tdeekens/flopflip/commit/c89cbc5d76a2420f58b312e7ca31d318375ffe39)]:
  - @flopflip/memory-adapter@12.5.5

## 12.5.4

### Patch Changes

- [`da4e3075`](https://github.com/tdeekens/flopflip/commit/da4e307557f462af33f4e3f053600f9df3eb8da2) Thanks [@tdeekens](https://github.com/tdeekens)! - Add a GitHub release

- Updated dependencies [[`da4e3075`](https://github.com/tdeekens/flopflip/commit/da4e307557f462af33f4e3f053600f9df3eb8da2)]:
  - @flopflip/memory-adapter@12.5.4

## 12.5.3

### Patch Changes

- [`ac088ccf`](https://github.com/tdeekens/flopflip/commit/ac088ccf55c443fe7c920792539e70f92d7ae49e) Thanks [@tdeekens](https://github.com/tdeekens)! - Release for GitHub release

- Updated dependencies [[`ac088ccf`](https://github.com/tdeekens/flopflip/commit/ac088ccf55c443fe7c920792539e70f92d7ae49e)]:
  - @flopflip/memory-adapter@12.5.3

## 12.5.2

### Patch Changes

- [`63f2a54a`](https://github.com/tdeekens/flopflip/commit/63f2a54a4a62d43e49ead767ae2fe3a1cb56063e) Thanks [@tdeekens](https://github.com/tdeekens)! - Another attempt to fix the GitHub release tab

- Updated dependencies [[`63f2a54a`](https://github.com/tdeekens/flopflip/commit/63f2a54a4a62d43e49ead767ae2fe3a1cb56063e)]:
  - @flopflip/memory-adapter@12.5.2

## 12.5.1

### Patch Changes

- [`eac3ea46`](https://github.com/tdeekens/flopflip/commit/eac3ea467ff2a41ecbf07d9f5f1a08b088b91c16) Thanks [@tdeekens](https://github.com/tdeekens)! - Fix release issue with updating release on GitHub

- Updated dependencies [[`eac3ea46`](https://github.com/tdeekens/flopflip/commit/eac3ea467ff2a41ecbf07d9f5f1a08b088b91c16)]:
  - @flopflip/memory-adapter@12.5.1

## 12.5.0

### Minor Changes

- [#1717](https://github.com/tdeekens/flopflip/pull/1717) [`c268ee5f`](https://github.com/tdeekens/flopflip/commit/c268ee5f66b318d044e385958247a7141d0f8cce) Thanks [@tdeekens](https://github.com/tdeekens)! - Versiong and release issue on path version.

### Patch Changes

- Updated dependencies [[`c268ee5f`](https://github.com/tdeekens/flopflip/commit/c268ee5f66b318d044e385958247a7141d0f8cce)]:
  - @flopflip/memory-adapter@12.5.0

## 12.4.0

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@12.4.0

## 12.3.8

### Patch Changes

- [#1707](https://github.com/tdeekens/flopflip/pull/1707) [`1db0d869`](https://github.com/tdeekens/flopflip/commit/1db0d8697c5739bf2768509a5d98796426f511f4) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies [[`1db0d869`](https://github.com/tdeekens/flopflip/commit/1db0d8697c5739bf2768509a5d98796426f511f4)]:
  - @flopflip/memory-adapter@12.3.8

## 12.3.7

### Patch Changes

- [#1704](https://github.com/tdeekens/flopflip/pull/1704) [`7569eaf7`](https://github.com/tdeekens/flopflip/commit/7569eaf7679ba4575d3ab23974be3b286c9a46dc) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies []:
  - @flopflip/memory-adapter@12.3.7

## 12.3.6

### Patch Changes

- [#1692](https://github.com/tdeekens/flopflip/pull/1692) [`dda66af9`](https://github.com/tdeekens/flopflip/commit/dda66af9d27cd600f01f5a9eb0dae6d71b0a403b) Thanks [@tdeekens](https://github.com/tdeekens)! - Fixes an issue with previous release

- Updated dependencies [[`dda66af9`](https://github.com/tdeekens/flopflip/commit/dda66af9d27cd600f01f5a9eb0dae6d71b0a403b)]:
  - @flopflip/memory-adapter@12.3.6

## 3.1.4

### Patch Changes

- [#1688](https://github.com/tdeekens/flopflip/pull/1688) [`37c71527`](https://github.com/tdeekens/flopflip/commit/37c71527404f3b7389662c4488bf9390c51e2d1a) Thanks [@renovate](https://github.com/apps/renovate)! - Update dependencies

- Updated dependencies [[`37c71527`](https://github.com/tdeekens/flopflip/commit/37c71527404f3b7389662c4488bf9390c51e2d1a)]:
  - @flopflip/memory-adapter@3.0.34

## 3.1.3

### Patch Changes

- [#1677](https://github.com/tdeekens/flopflip/pull/1677) [`12a30d04`](https://github.com/tdeekens/flopflip/commit/12a30d04b64296171ac5de7fac964d98cf86452a) Thanks [@tdeekens](https://github.com/tdeekens)! - Update dependencies

- Updated dependencies [[`12a30d04`](https://github.com/tdeekens/flopflip/commit/12a30d04b64296171ac5de7fac964d98cf86452a)]:
  - @flopflip/memory-adapter@3.0.33

## 3.1.2

### Patch Changes

- [#1661](https://github.com/tdeekens/flopflip/pull/1661) [`360a61c5`](https://github.com/tdeekens/flopflip/commit/360a61c57b0b7deb3d63538e04615b83e446e923) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies []:
  - @flopflip/memory-adapter@3.0.32

## 3.1.1

### Patch Changes

- [#1648](https://github.com/tdeekens/flopflip/pull/1648) [`75872793`](https://github.com/tdeekens/flopflip/commit/7587279337e5828ff1ba6b047725a165ad5df2db) Thanks [@renovate](https://github.com/apps/renovate)! - Update all dependencies

- Updated dependencies [[`75872793`](https://github.com/tdeekens/flopflip/commit/7587279337e5828ff1ba6b047725a165ad5df2db)]:
  - @flopflip/memory-adapter@3.0.31

## 3.1.0

### Minor Changes

- [#1635](https://github.com/tdeekens/flopflip/pull/1635) [`ea64c97f`](https://github.com/tdeekens/flopflip/commit/ea64c97fdbcb5ca392993e5cb6b36a1171c31dd9) Thanks [@renovate](https://github.com/apps/renovate)! - Add support for React v18

### Patch Changes

- [#1640](https://github.com/tdeekens/flopflip/pull/1640) [`9cac278c`](https://github.com/tdeekens/flopflip/commit/9cac278cced8377f0e759608afbd9db8fb4894ef) Thanks [@tdeekens](https://github.com/tdeekens)! - Update dependencies

- Updated dependencies [[`9cac278c`](https://github.com/tdeekens/flopflip/commit/9cac278cced8377f0e759608afbd9db8fb4894ef)]:
  - @flopflip/memory-adapter@3.0.30

## 3.0.30

### Patch Changes

- [#1625](https://github.com/tdeekens/flopflip/pull/1625) [`50d202af`](https://github.com/tdeekens/flopflip/commit/50d202af3379bc3c6e28e78f34c6a1506f241de9) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies [[`50d202af`](https://github.com/tdeekens/flopflip/commit/50d202af3379bc3c6e28e78f34c6a1506f241de9)]:
  - @flopflip/memory-adapter@3.0.29

## 3.0.29

### Patch Changes

- [#1614](https://github.com/tdeekens/flopflip/pull/1614) [`36ade93e`](https://github.com/tdeekens/flopflip/commit/36ade93e602ec9478af005bba0c4abd9a46daf08) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies [[`36ade93e`](https://github.com/tdeekens/flopflip/commit/36ade93e602ec9478af005bba0c4abd9a46daf08)]:
  - @flopflip/memory-adapter@3.0.28

## 3.0.28

### Patch Changes

- Updated dependencies [[`aea0a3aa`](https://github.com/tdeekens/flopflip/commit/aea0a3aaf0e3d53fa3dc18868f40f7a5650f4099)]:
  - @flopflip/memory-adapter@3.0.27

## 3.0.27

### Patch Changes

- [#1604](https://github.com/tdeekens/flopflip/pull/1604) [`4f13cb85`](https://github.com/tdeekens/flopflip/commit/4f13cb85167d33e89d03aeaba2d991f2a9f0728c) Thanks [@tdeekens](https://github.com/tdeekens)! - Refactor to import fixes from pnpm migration to `main`

- Updated dependencies []:
  - @flopflip/memory-adapter@3.0.26

## 3.0.26

### Patch Changes

- [#1586](https://github.com/tdeekens/flopflip/pull/1586) [`7272bce5`](https://github.com/tdeekens/flopflip/commit/7272bce5fdd25736798115d91196e404ca79f741) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies [[`7272bce5`](https://github.com/tdeekens/flopflip/commit/7272bce5fdd25736798115d91196e404ca79f741)]:
  - @flopflip/memory-adapter@3.0.25

## 3.0.25

### Patch Changes

- [#1558](https://github.com/tdeekens/flopflip/pull/1558) [`3624d423`](https://github.com/tdeekens/flopflip/commit/3624d42357145a13432b74dceccb4ad1682c5509) Thanks [@tdeekens](https://github.com/tdeekens)! - Refactor to use TypeScript v4.5 feature of inline type imports

- Updated dependencies [[`3624d423`](https://github.com/tdeekens/flopflip/commit/3624d42357145a13432b74dceccb4ad1682c5509)]:
  - @flopflip/memory-adapter@3.0.24

## 3.0.24

### Patch Changes

- [#1543](https://github.com/tdeekens/flopflip/pull/1543) [`5c02eb83`](https://github.com/tdeekens/flopflip/commit/5c02eb830a0019b326bb0510a5a15f62e5dfe348) Thanks [@tdeekens](https://github.com/tdeekens)! - refactor: to migrate to yarn#3

- Updated dependencies [[`5c02eb83`](https://github.com/tdeekens/flopflip/commit/5c02eb830a0019b326bb0510a5a15f62e5dfe348)]:
  - @flopflip/memory-adapter@3.0.23

## 3.0.23

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@3.0.22

## 3.0.22

### Patch Changes

- [`a14d3863`](https://github.com/tdeekens/flopflip/commit/a14d3863e97546da0ccd5877555eace3650f2a60) Thanks [@tdeekens](https://github.com/tdeekens)! - Publish all packages

- Updated dependencies [[`a14d3863`](https://github.com/tdeekens/flopflip/commit/a14d3863e97546da0ccd5877555eace3650f2a60)]:
  - @flopflip/memory-adapter@3.0.21

## 3.0.21

### Patch Changes

- [#1501](https://github.com/tdeekens/flopflip/pull/1501) [`e37f3b6e`](https://github.com/tdeekens/flopflip/commit/e37f3b6eb579cba656c6ac6d238e7912c17a5962) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

## 3.0.20

### Patch Changes

- Updated dependencies [[`99c06a04`](https://github.com/tdeekens/flopflip/commit/99c06a040ba9904b239b42b0885f807dbcebf8cc)]:
  - @flopflip/memory-adapter@3.0.20

## 3.0.19

### Patch Changes

- [#1469](https://github.com/tdeekens/flopflip/pull/1469) [`62168194`](https://github.com/tdeekens/flopflip/commit/62168194057adb8ef39c9634b4fb0d420a812414) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies [[`62168194`](https://github.com/tdeekens/flopflip/commit/62168194057adb8ef39c9634b4fb0d420a812414)]:
  - @flopflip/memory-adapter@3.0.19

## 3.0.18

### Patch Changes

- [#1464](https://github.com/tdeekens/flopflip/pull/1464) [`ef59e379`](https://github.com/tdeekens/flopflip/commit/ef59e379764bc04903ab6dc6b1e1ad42e7288b93) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies [[`ef59e379`](https://github.com/tdeekens/flopflip/commit/ef59e379764bc04903ab6dc6b1e1ad42e7288b93)]:
  - @flopflip/memory-adapter@3.0.18

## 3.0.17

### Patch Changes

- [#1457](https://github.com/tdeekens/flopflip/pull/1457) [`fe4fdfc0`](https://github.com/tdeekens/flopflip/commit/fe4fdfc0c51de4364d6ad2e881947d77780faabf) Thanks [@renovate](https://github.com/apps/renovate)! - fix(deps): update all dependencies

- Updated dependencies []:
  - @flopflip/memory-adapter@3.0.17

## 3.0.16

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@3.0.16

## 3.0.15

### Patch Changes

- [#1438](https://github.com/tdeekens/flopflip/pull/1438) [`10f981f5`](https://github.com/tdeekens/flopflip/commit/10f981f556284c5908b2be0d792db007a4002256) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

- Updated dependencies [[`10f981f5`](https://github.com/tdeekens/flopflip/commit/10f981f556284c5908b2be0d792db007a4002256)]:
  - @flopflip/memory-adapter@3.0.15

## 3.0.14

### Patch Changes

- [`bc7b3f41`](https://github.com/tdeekens/flopflip/commit/bc7b3f413554c4b11ab52ecdc5983da348014885) [#1414](https://github.com/tdeekens/flopflip/pull/1414) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update dependencies and add eslint sorting of imports

- Updated dependencies [[`bc7b3f41`](https://github.com/tdeekens/flopflip/commit/bc7b3f413554c4b11ab52ecdc5983da348014885)]:
  - @flopflip/memory-adapter@3.0.14

## 3.0.13

### Patch Changes

- [`8707dfd8`](https://github.com/tdeekens/flopflip/commit/8707dfd8a34fd581a5e7db448bd3c635d79cfad0) [#1408](https://github.com/tdeekens/flopflip/pull/1408) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

- Updated dependencies [[`8707dfd8`](https://github.com/tdeekens/flopflip/commit/8707dfd8a34fd581a5e7db448bd3c635d79cfad0)]:
  - @flopflip/memory-adapter@3.0.13

## 3.0.12

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@3.0.12

## 3.0.11

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@3.0.11

## 3.0.10

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@3.0.10

## 3.0.9

### Patch Changes

- [`e12bda8`](https://github.com/tdeekens/flopflip/commit/e12bda837d42b3a516f47bfe9241162668fa9963) [#1393](https://github.com/tdeekens/flopflip/pull/1393) Thanks [@tdeekens](https://github.com/tdeekens)! - update dependencies

- Updated dependencies [[`e12bda8`](https://github.com/tdeekens/flopflip/commit/e12bda837d42b3a516f47bfe9241162668fa9963)]:
  - @flopflip/memory-adapter@3.0.9

## 3.0.8

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@3.0.8

## 3.0.7

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@3.0.7

## 3.0.6

### Patch Changes

- [`1a1d468`](https://github.com/tdeekens/flopflip/commit/1a1d468a454c70482f9cf7412858a3007cbeb9b8) [#1384](https://github.com/tdeekens/flopflip/pull/1384) Thanks [@tdeekens](https://github.com/tdeekens)! - chore: update deps

- Updated dependencies []:
  - @flopflip/memory-adapter@3.0.6

## 3.0.5

### Patch Changes

- Updated dependencies [[`498f3bc`](https://github.com/tdeekens/flopflip/commit/498f3bcdc605f60bd8e72924cdef08c4a079d4f1), [`92ebba8`](https://github.com/tdeekens/flopflip/commit/92ebba83bdf1fb876ad830db124c306de6f5c86d)]:
  - @flopflip/memory-adapter@3.0.5

## 3.0.4

### Patch Changes

- Updated dependencies []:
  - @flopflip/memory-adapter@3.0.4

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
