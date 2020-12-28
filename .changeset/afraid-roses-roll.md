---
'@flopflip/graphql-adapter': major
'@flopflip/launchdarkly-adapter': major
'@flopflip/localstorage-adapter': major
'@flopflip/memory-adapter': major
'@flopflip/react': major
'@flopflip/splitio-adapter': major
'@flopflip/types': major
---

refactor: to remove isAdapterReady

The deprecated `adapter.getIsReady` and FaaC of `isAdapterReady` is removed. Please now `adapter.getIsConfigured` and `isAdapterConfigured`.
