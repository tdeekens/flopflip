---
"@flopflip/adapter-utilities": major
"@flopflip/graphql-adapter": major
"@flopflip/launchdarkly-adapter": major
"@flopflip/localstorage-adapter": major
"@flopflip/memory-adapter": major
"@flopflip/react-broadcast": patch
"@flopflip/react-redux": patch
"@flopflip/react": patch
"@flopflip/splitio-adapter": patch
"@flopflip/test-utils": major
---

refactor: updateFlags to be only on adapter

The `updateFlags` export from each adapter is no longer present. Please use the `adapter.updateFlags` function instead. The prior was a re-export of the latter for longer anyway.

This affects also other locations you should hopefully not be affected by:

1. `test-utils`: does not export `updateFlags` anymore. Use `adapter.updateFlags`
2. Globals: The globals on the window do not contain a `window.__flopflip__.[id].updateFlags` anymore
