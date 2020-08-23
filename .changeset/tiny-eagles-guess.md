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
