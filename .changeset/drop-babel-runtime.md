---
'@flopflip/adapter-utilities': patch
'@flopflip/combine-adapters': patch
'@flopflip/graphql-adapter': patch
'@flopflip/http-adapter': patch
'@flopflip/launchdarkly-adapter': patch
'@flopflip/localstorage-adapter': patch
'@flopflip/memory-adapter': patch
'@flopflip/react': patch
'@flopflip/react-broadcast': patch
'@flopflip/react-redux': patch
'@flopflip/splitio-adapter': patch
---

fix: drop the unused `@babel/runtime` dependency

The packages are built with tsdown, which does not use Babel, so nothing imports `@babel/runtime`. Consumers no longer install it.
