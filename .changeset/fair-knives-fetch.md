---
"@flopflip/react-broadcast": minor
"@flopflip/react-redux": minor
"@flopflip/react": minor
---

The `useAdapterStatus` hooks now allow to fetch status of one or more adapters instead of always all.

You can pass the `adapterIdentifiers` argument which is of type `TAdapterIdentifiers[]`. This means you can:

```js
const status = useAdapterStatus({ adapterIdentifiers: ['http', 'memory] });
```

This returns `isConfigured` once both adapters have reached the configurd state.
