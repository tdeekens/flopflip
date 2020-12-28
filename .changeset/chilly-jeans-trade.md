---
"@flopflip/cypress-plugin": patch
"@flopflip/graphql-adapter": patch
"@flopflip/launchdarkly-adapter": patch
"@flopflip/localstorage-adapter": patch
"@flopflip/memory-adapter": patch
"@flopflip/react-broadcast": major
"@flopflip/react-redux": major
"@flopflip/react": major
"@flopflip/splitio-adapter": patch
"@flopflip/types": patch
---

feat: allow adapters to affect each others state

An adapter can now have an `effectIds` besides its own `id`. This allows one adapter to effect other adapters state. In turn allowing flopflip to theoretically support multiple adapters.
