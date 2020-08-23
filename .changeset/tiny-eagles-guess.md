---
"@flopflip/cypress-plugin": minor
"@flopflip/launchdarkly-adapter": minor
"@flopflip/localstorage-adapter": minor
"@flopflip/memory-adapter": minor
"@flopflip/splitio-adapter": minor
---

feat: to expose adapters globally

Exposing adapters globally simplifies a lot of integrations we can perform. Each adapter gets a namespace according to its `TAdapterInterfaceIdentifiers`. So we have `launchdarkly`, `memory`, etc on the `__flopflip__` global namespace.

We use the `globalThis` polyfill and TC39 spec to correctly determine the global this in any context and assign each adapter instance as `adapter` and `updateFlags`.

This means you could do `window.__flopflip__.launchdarkly.updateFlags` now.

With the next version of the `cypress-plugin` we also simplify the API. As we're not `1.x.x` we don't consider it breaking. You now have to pass an `TAdapterInterfaceIdentifiers` so that the plugin can correlate the adapter internally. This means you could do

```js
+addCommands({ adapterId: 'launchdarkly' })
-addCommands({ adapter: adapter, updateFlags, updateFlags })
```
