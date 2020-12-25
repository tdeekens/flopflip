# @flopflip/graphql-adapter

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
