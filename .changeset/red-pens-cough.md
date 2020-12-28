---
'@flopflip/graphql-adapter': patch
'@flopflip/launchdarkly-adapter': patch
'@flopflip/localstorage-adapter': patch
'@flopflip/memory-adapter': patch
'@flopflip/splitio-adapter': patch
'@flopflip/types': patch
---

refactor: adapters to use instance variables

This is a large refactor which changes all adapters to use instance variables over properties on the modules. During this refactora a public and private class variables were used.

This should be entirely backwards compatible but is quite a large change. Please report any issues you see.
