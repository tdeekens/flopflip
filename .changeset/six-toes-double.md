---
"@flopflip/launchdarkly-adapter": major
"@flopflip/types": major
---

Refactor to support v3 of the LaunchDarkly JavaScript SDK. The offical migration guide can be found [here](https://docs.launchdarkly.com/sdk/client-side/javascript/migration-2-to-3). 

If you're using LaunchDarkly as your adapter, then the shape of the `adapterArgs` passed to `ConfigureFlopflip` has changed.

Assuming you are currently only using a user context (please refer to LaunchDarkly's documentation for more) then your previous configuration was:

```jsx
<ConfigureFlopFlip
  adapter={adapter}
  adapterArgs={{ sdk: { clientSideId }, user }}
>
  <App />
</ConfigureFlopFlip>;
```

You will have to replace `user` with `context`

```diff
<ConfigureFlopFlip
  adapter={adapter}
-  adapterArgs={{ sdk: { clientSideId }, user }}
+  adapterArgs={{ sdk: { clientSideId }, context }}
>
  <App />
</ConfigureFlopFlip>;
```

The `context` itself which previously was a `user` of for instance

```js
user: {
  key: props.user?.id,
  custom: {
     foo: 'bar'
  }
},
```

should now be

```js
context: {
  kind: 'user',
  key: props.user?.id,
  foo: 'bar'
},
```

Please note that if you previously used a large user object with a lot of different information you might want to think about splitting it. This is the main purpose of the change on LaunchDarkly's side.

```js
const deviceContext = {
  kind: 'device',
  type: 'iPad',
  key: 'device-key-123abc'
}

const userContext = {
  kind: 'user',
  key: 'user-key-123abc',
  name: 'Sandy',
  role: 'doctor'
}

const multiContext = {
  kind: 'multi',
  user: userContext,
  device: deviceContext
}
```
