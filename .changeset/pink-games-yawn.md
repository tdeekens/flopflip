---
"@flopflip/react-broadcast": minor
"@flopflip/react-redux": minor
"@flopflip/react": minor
"@flopflip/types": minor
---

feat: add support for number json variations

Prior to this `@flopflip` supported `sttring` or `boolean` variations. With it it also supports JSON variations (as LaunchDarkly calls them). For `@flopflip` these variations are of type `Record<string, unknown>` or `unknown[]`. In the future we might allow passing in a generic to narrow down the type.
