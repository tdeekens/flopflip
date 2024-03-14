---
"@flopflip/launchdarkly-adapter": minor
"@flopflip/types": minor
---

Allow cached flags to be updated silently only taking effect whenever adapter is configured again.

You can pass `unsubscribeFromCachedFlags` as an `adapterArg` to the LaunchDarkly adapter to try this out.
