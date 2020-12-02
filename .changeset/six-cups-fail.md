---
"@flopflip/graphql-adapter": patch
"@flopflip/types": patch
---

feat(gtaphql-adapter): add graphql adapter

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
