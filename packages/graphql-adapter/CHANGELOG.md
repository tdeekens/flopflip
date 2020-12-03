# @flopflip/graphql-adapter

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
