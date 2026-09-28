---
'@flopflip/combine-adapters': patch
'@flopflip/graphql-adapter': patch
'@flopflip/http-adapter': patch
'@flopflip/launchdarkly-adapter': patch
'@flopflip/localstorage-adapter': patch
'@flopflip/memory-adapter': patch
---

fix(adapters): stop leaking state across `reset()` and repeated `configure()`

- `reset()` now returns an adapter to its initial state. Previously, locked flags and event handlers survived a reset because every instance and reset shared the same `Set` and emitter, so updates to a previously locked flag were ignored. The http and graphql adapters also stop polling for flags on `reset()`.
- `configure()` now replaces the event handlers of a previous `configure()` call instead of adding to them. Previously, calling it twice, for example through a remount or React's StrictMode, invoked every handler set on each change. If you relied on handlers from an earlier `configure()` call staying active, pass all handlers to the latest call.
- The localstorage adapter no longer starts an additional polling interval on every `configure()`.
