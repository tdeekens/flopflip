---
"@flopflip/http-adapter": patch
"@flopflip/launchdarkly-adapter": patch
---

Fix the `http-adapter` to not flush empty flags with unchanged reconfiguration of the same user.
