---
"@flopflip/launchdarkly-adapter": minor
"@flopflip/localstorage-adapter": minor
"@flopflip/memory-adapter": minor
"@flopflip/splitio-adapter": patch
---

feat: add the notion of locked flags and `updateFlags` to 3 out of 4 adapters

The three adapters `launchdarkly-adapter`, `localstorage-adapter` and `memory-adapter` now expose a `updateFlags` method.

You can now:

```js
import { updateFlags } from '@flopflip/launchdarkly-adapter';

updateFlags({ myFlag: true })
```

which will internally set the flag value of `myFlag` to `true` and lock the flag from changing via the LaunchDarkly API. You can pass `{ lockFlags: false }` as an second argument to keep flag updates.

The same applied for the `localstorage-adapter` adapter. Where updating a flag will not yield it being locked but you can opt-in via `{ lockFlags: true }`. So far only the `launchdarkly-adapter` locks flags by default when using `updateFlags`. This default is sensible as flag value can easily be overwritten by the LaunchDarkly socket connection giving an update.
