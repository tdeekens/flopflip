---
'@flopflip/graphql-adapter': major
'@flopflip/launchdarkly-adapter': major
'@flopflip/localstorage-adapter': major
'@flopflip/splitio-adapter': major
'@flopflip/types': patch
---

refactor(adapters): to split out sdk options

This release splits the `adapterArgs` or adapters which use an underlying SDK. Prior `adapterArgs` bound to `@flopflip`'s adapter and the underlying SDK (e.g. by LauncDarkly) were mixed.

This release introduces a new `sdk` field on the `adapterArgs` which contain only fields forwarded to an underlying SDK. This also allows the nested `adapterConfiguration` field to become top-level as it is bound to the adapter.

In essenence: `adapterConfiguration` is now directly flat out on `adapterArgs` while any SDK fields are nested into the `sdk` field.

**splitio-adapter**

- `sdk.authorizationKey`: Authorization key for splitio
- `sdk.options`: General attributes passed to splitio SDK
- `sdk.treatmentAttributes`: The treatment attributes passed to splitio

Over `adapterArgs.{authorizationKey, options, treatmentAttributes}`

**launchdarkly-adapter**

- `sdk.clientSideId`
- `sdk.clientOptions`

Over `adapterArgs.{clientSideId, clientOptions}`.

**graphql-adapter**

All fields are now top-level not under `adapterConfiguration`

**localstorage-adapter**

All fields are now top-level not under `adapterConfiguration` while it is now `pollingInteralMs` not `pollingInteral`.
