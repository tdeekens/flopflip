<p align="center">
  <img alt="Logo" src="https://raw.githubusercontent.com/tdeekens/flopflip/main/logo.png" width="250" /><br /><br />
</p>

<h2 align="center">🎚 flopflip - Feature Toggling 🚦</h2>
<p align="center">
  <b>Toggle (flip or flop) features being stored in Redux or in a broadcasting system (through the context) via a set of React components or HoCs.</b>
</p>

<p align="center">
  <sub>
  ❤️
  React
  · Redux
  · Vitest
  · Turbo
  · TypeScript
  · @testing-library/react
  · Biome
  · Lodash
  · Changesets
  · tsup
  · pnpm
  🙏
  </sub>
</p>

<p align="center">
  <a href="https://github.com/tdeekens/flopflip/actions?query=workflow%3A%22Test+and+Build%22">
    <img alt="GitHub Action Status" src="https://github.com/tdeekens/flopflip/workflows/test/badge.svg">
  </a>
  <a href="https://codecov.io/gh/tdeekens/flopflip">
    <img alt="Codecov Coverage Status" src="https://img.shields.io/codecov/c/github/tdeekens/flopflip.svg?style=flat-square">
  </a>
  <a href="https://snyk.io/test/github/tdeekens/flopflip"><img src="https://snyk.io/test/github/tdeekens/flopflip/badge.svg" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/{username}/{repo}" style="max-width:100%;"/></a>
  <img alt="Made with Coffee" src="https://img.shields.io/badge/made%20with-%E2%98%95%EF%B8%8F%20coffee-yellow.svg">
  <br /><br />
  <a href="https://techblog.commercetools.com/embracing-real-time-feature-toggling-in-your-react-application-a5e6052716a9">
    Embracing real-time feature toggling in your React application
  </a><br /><br />
  <a href="https://www.youtube.com/watch?v=x-IqMNFPmkk">
    Feature flagging with LaunchDarkly - Fun Fun Function
  </a>
</p>

<details><br /><br />
  <summary><b>Want to see a demo?</b></summary>

  <img alt="Demo" src="https://raw.githubusercontent.com/tdeekens/flopflip/main/demo.gif" />
  <br /><br />
</details>

## Table of Contents

- [Why you might use this](#-why-you-might-use-this)
- [Package Status](#-package-status)
- [Installation](#-installation)
- [Getting Started](#-getting-started)
  - [Using react-broadcast (Context)](#using-react-broadcast-context)
  - [Using react-redux (Redux)](#using-react-redux-redux)
  - [Setup through a Redux store enhancer](#setup-through-a-redux-store-enhancer)
  - [Reconfiguring adapters](#reconfiguring-adapters)
- [Adapters](#-adapters)
  - [LaunchDarkly adapter](#launchdarkly-adapter)
  - [Split.io adapter](#splitio-adapter)
  - [GraphQL adapter](#graphql-adapter)
  - [HTTP adapter](#http-adapter)
  - [LocalStorage adapter](#localstorage-adapter)
  - [Memory adapter](#memory-adapter)
- [API Reference](#-api-reference)
  - [Hooks](#hooks)
  - [Components](#components)
  - [Higher-Order Components](#higher-order-components)
  - [Redux API (react-redux only)](#redux-api-react-redux-only)
- [Cypress Plugin](#-cypress-plugin)
- [Module Formats](#-module-formats)
- [Browser Support](#-browser-support)

## ❯ Why you might use this

In summary feature toggling simplifies and speeds up your development processes. You can ship software more often, release to specified target audiences and test features with users (not only internal staff) before releasing them to everyone.

With `flopflip` you get many options and ways to toggle features. More elaborate examples below. For now imagine you have a new feature which is not finished developing. However, UX and QA already need access to it. It's hidden by a `<Link>` component redirecting. To toggle it all you need is:

```jsx
<ToggleFeature flag="featureFlagName">
  <Link to="url/to/new/feature" />
</ToggleFeature>
```

Having `flopflip` setup up you can now target users by whatever you decide to send to e.g. LaunchDarkly. This could be location, hashed E-Mails or any user groups (please respect your user's privacy).

Another example would be to show a `<button>` but disable it for users who should not have access to the feature yet:

```jsx
<ToggleFeature flag="featureFlagName">
  {({ isFeatureEnabled }) => (
    <button disabled={!isFeatureEnabled} onClick={this.handleClick}>
      Try out feature
    </button>
  )}
</ToggleFeature>
```

...or given you are using a React version with hooks and `@flopflip/react-broadcast` you can:

```jsx
const MyFunctionComponent = () => {
  const isFeatureEnabled = useFeatureToggle("featureFlagName");
  const handleClick = () => console.log("🦄");

  return (
    <button disabled={!isFeatureEnabled} onClick={handleClick}>
      Try out feature
    </button>
  );
};
```

In all examples flags will update in realtime (depending on the adapter and provider) and the User Interface will update accordingly. If this sounds interesting to you, keep reading.

## ❯ Package Status

| Package                                                  | Version                                                                                                                                                                                                       | Downloads                                                                                           | Sizes                                                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [`react`](/packages/react)                               | [![react Version][react-latest-icon]][react-latest-version] [![react Version][react-next-icon]][react-next-version]                                                                                           | [![react Downloads][react-downloads]][react-downloads]                                              | [![react Minified + GZipped][react-size]][react-size]                                              |
| [`react-broadcast`](/packages/react-broadcast)           | [![react-broadcast Version][react-broadcast-latest-icon]][react-broadcast-latest-version] [![react-broadcast Version][react-broadcast-next-icon]][react-broadcast-next-version]                               | [![react-broadcast Downloads][react-broadcast-downloads]][react-broadcast-downloads]                | [![react-broadcast Minified + GZipped][react-broadcast-size]][react-broadcast-size]                |
| [`react-redux`](/packages/react-redux)                   | [![react-redux Version][react-redux-latest-icon]][react-redux-latest-version] [![react-redux Version][react-redux-next-icon]][react-redux-next-version]                                                       | [![react-redux Downloads][react-redux-downloads]][react-redux-downloads]                            | [![react-redux Minified + GZipped][react-redux-size]][react-redux-size]                            |
| [`launchdarkly-adapter`](/packages/launchdarkly-adapter) | [![launchdarkly-adapter Version][launchdarkly-adapter-latest-icon]][launchdarkly-adapter-latest-version] [![launchdarkly-adapter Version][launchdarkly-adapter-next-icon]][launchdarkly-adapter-next-version] | [![launchdarkly-adapter Downloads][launchdarkly-adapter-downloads]][launchdarkly-adapter-downloads] | [![launchdarkly-adapter Minified + GZipped][launchdarkly-adapter-size]][launchdarkly-adapter-size] |
| [`splitio-adapter`](/packages/splitio-adapter)           | [![splitio-adapter Version][splitio-adapter-latest-icon]][splitio-adapter-latest-version] [![splitio-adapter Version][splitio-adapter-next-icon]][splitio-adapter-next-version]                               | [![splitio-adapter Downloads][splitio-adapter-downloads]][splitio-adapter-downloads]                | [![splitio-adapter Minified + GZipped][splitio-adapter-size]][splitio-adapter-size]                |
| [`memory-adapter`](/packages/memory-adapter)             | [![memory-adapter Version][memory-adapter-latest-icon]][memory-adapter-latest-version] [![memory-adapter Version][memory-adapter-next-icon]][memory-adapter-next-version]                                     | [![memory-adapter Downloads][memory-adapter-downloads]][memory-adapter-downloads]                   | [![memory-adapter Minified + GZipped][memory-adapter-size]][memory-adapter-size]                   |
| [`localstorage-adapter`](/packages/localstorage-adapter) | [![localstorage-adapter Version][localstorage-adapter-latest-icon]][localstorage-adapter-latest-version] [![localstorage-adapter Version][localstorage-adapter-next-icon]][localstorage-adapter-next-version] | [![localstorage-adapter Downloads][localstorage-adapter-downloads]][localstorage-adapter-downloads] | [![localstorage-adapter Minified + GZipped][localstorage-adapter-size]][localstorage-adapter-size] |
| [`graphql-adapter`](/packages/graphql-adapter)           | [![graphql-adapter Version][graphql-adapter-latest-icon]][graphql-adapter-latest-version] [![graphql-adapter Version][graphql-adapter-next-icon]][graphql-adapter-next-version]                               | [![graphql-adapter Downloads][graphql-adapter-downloads]][graphql-adapter-downloads]                | [![graphql-adapter Minified + GZipped][graphql-adapter-size]][graphql-adapter-size]                |
| [`http-adapter`](/packages/http-adapter)                 | [![http-adapter Version][http-adapter-latest-icon]][http-adapter-latest-version] [![http-adapter Version][http-adapter-next-icon]][http-adapter-next-version]                                                 | [![http-adapter Downloads][http-adapter-downloads]][http-adapter-downloads]                         | [![http-adapter Minified + GZipped][http-adapter-size]][http-adapter-size]                         |
| [`combine-adapters`](/packages/combine-adapters)         | [![combine-adapters Version][combine-adapters-latest-icon]][combine-adapters-latest-version] [![combine-adapters Version][combine-adapters-next-icon]][combine-adapters-next-version]                         | [![combine-adapters Downloads][combine-adapters-downloads]][combine-adapters-downloads]             | [![combine-adapters Minified + GZipped][combine-adapters-size]][combine-adapters-size]             |
| [`cypress-plugin`](/packages/cypress-plugin)             | [![cypress-plugin Version][cypress-plugin-latest-icon]][cypress-plugin-latest-version] [![cypress-plugin Version][cypress-plugin-next-icon]][cypress-plugin-next-version]                                     | [![cypress-plugin Downloads][cypress-plugin-downloads]][cypress-plugin-downloads]                   | [![cypress-plugin Minified + GZipped][cypress-plugin-size]][cypress-plugin-size]                   |
| [`types`](/packages/types)                               | [![types Version][types-latest-icon]][types-latest-version] [![types Version][types-next-icon]][types-next-version]                                                                                           | [![types Downloads][types-downloads]][types-downloads]                                              | [![types Minified + GZipped][types-size]][types-size]                                              |

## ❯ Installation

This is a mono repository maintained using
[changesets](https://github.com/atlassian/changesets). It currently contains
multiple [packages](/packages) including adapters (`launchdarkly-adapter`,
`splitio-adapter`, `graphql-adapter`, `http-adapter`, `memory-adapter`,
`localstorage-adapter`), integration bindings (`react-broadcast`, `react-redux`),
a shared `react` package, a `cypress-plugin`, `combine-adapters`, and supporting
utilities (`types`, `cache`, `adapter-utilities`). You should not need an adapter
package directly but rather one of our bindings (`react-broadcast` or
`react-redux`). Both use the `react` package to share components.

Depending on the preferred integration (with or without redux) use:

`yarn add @flopflip/react-redux` or `npm i @flopflip/react-redux --save`

or

`yarn add @flopflip/react-broadcast` or `npm i @flopflip/react-broadcast --save`

## ❯ Getting Started

Flopflip allows you to manage feature flags through the notion of adapters (e.g.
LaunchDarkly or LocalStorage) within an application written using React with or
without Redux.

You can set up flopflip to work in two ways:

1. Use React's Context (hidden for you) via `@flopflip/react-broadcast`
2. Integrate with Redux via `@flopflip/react-redux`

Often using `@flopflip/react-broadcast` will be the easiest way to get started. You would just need to pick an adapter which can be any of the provided. Either just a `memory-adapter` or an integration with LaunchDarkly via `launchdarkly-adapter` will work.

Whenever you want the flag state to live in Redux you can use `@flopflip/react-redux` which can be set up in two variations itself:

1. Using [`ConfigureFlopFlip`](#using-react-redux-redux) for simpler use cases
2. With a Redux [store enhancer](#setup-through-a-redux-store-enhancer)

The store enhancer replaces `ConfigureFlopFlip` for setup and gives the ability to pass in a `preloadedState` as default flags. For `ConfigureFlopFlip` the default flags would be passed as a `defaultFlags` prop.

### Using react-broadcast (Context)

The minimal configuration for a setup with `@flopflip/react-broadcast` and
LaunchDarkly would be nothing more than:

```jsx
import { ConfigureFlopFlip } from "@flopflip/react-broadcast";
import { adapter } from "@flopflip/launchdarkly-adapter";
// or import { adapter } from '@flopflip/memory-adapter';
// or import { adapter } from '@flopflip/localstorage-adapter';

<ConfigureFlopFlip
  adapter={adapter}
  adapterArgs={{ sdk: { clientSideId }, context }}
>
  <App />
</ConfigureFlopFlip>;
```

You can also pass `render` or `children` as a function to act differently based on the underlying adapter's ready state:

```jsx
<ConfigureFlopFlip
  adapter={adapter}
  adapterArgs={{ sdk: { clientSideId }, context }}
>
  {(isAdapterConfigured) =>
    isAdapterConfigured ? <App /> : <LoadingSpinner />
  }
</ConfigureFlopFlip>
```

```jsx
<ConfigureFlopFlip
  adapter={adapter}
  adapterArgs={{ sdk: { clientSideId }, context }}
  render={() => <App />}
/>
```

Note that `children` will be called with a loading state prop while `render` will only be called when the adapter is configured. This behaviour mirrors the workings of `<ToggleFeature>`.

`ConfigureFlopFlip` from `@flopflip/react-broadcast` will use the context and a
broadcasting system to reliably communicate with children toggling features (you
do not have to worry about any component returning `false` from
`shouldComponentUpdate`).

### Using react-redux (Redux)

If you prefer to have the feature flag's state persisted in redux you
would add a reducer when creating your store.

```jsx
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  ConfigureFlopFlip,
  flopflipReducer,
  FLOPFLIP_STATE_SLICE,
} from "@flopflip/react-redux";

// Maintained somewhere within your application
import { user } from "./user";
import { appReducer } from "./reducer";

const rootReducer = combineReducers({
  appReducer,
  [FLOPFLIP_STATE_SLICE]: flopflipReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  preloadedState: initialState,
});

export default store;
```

### Setup through a Redux store enhancer

Another way to configure `flopflip` is using a store enhancer. For this a
`flopflip` reducer should be wired up with a `combineReducers` within your
application in coordination with the `FLOPFLIP_STATE_SLICE` which is used internally
to manage the location of the feature toggle states. This setup eliminates the
need to use `ConfigureFlopFlip` somewhere else in your application's component
tree.

In context this configuration could look like:

```jsx
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  createFlopFlipEnhancer,
  flopflipReducer,
  FLOPFLIP_STATE_SLICE,
} from "@flopflip/react-redux";
import { adapter } from "@flopflip/launchdarkly-adapter";

// Maintained somewhere within your application
import { context } from "./context";
import { appReducer } from "./reducer";

const rootReducer = combineReducers({
  appReducer,
  [FLOPFLIP_STATE_SLICE]: flopflipReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      createFlopFlipEnhancer(adapter, {
        sdk: { clientSideId: window.application.env.LD_CLIENT_ID },
        context,
      })
    ),
  preloadedState: initialState,
});

export default store;
```

`@flopflip/react-redux` also exports a `createFlopflipReducer(preloadedState: Flags)`. This is useful when you want to populate the redux store with initial values for your flags:

```jsx
const defaultFlags = { flagA: true, flagB: false };

const rootReducer = combineReducers({
  appReducer,
  [FLOPFLIP_STATE_SLICE]: createFlopflipReducer(defaultFlags),
});

const store = configureStore({
  reducer: rootReducer,
});
```

This way you can pass `defaultFlags` as the `preloadedState` directly into the `flopflipReducer`. This means you do not need to keep track of it in your application's `initialState` as in the following anti-pattern example:

> **Avoid this pattern** -- use `createFlopflipReducer` instead.

```jsx
const initialState = {
  [FLOPFLIP_STATE_SLICE]: { flagA: true, flagB: false },
};

const rootReducer = combineReducers({
  appReducer,
  [FLOPFLIP_STATE_SLICE]: flopflipReducer,
});

const store = configureStore({
  reducer: rootReducer,
  preloadedState: initialState,
});
```

In addition to initiating `flopflip` when creating your store, you could still wrap most or all of your application's tree in
`ConfigureFlopFlip`. This is needed when you want to identify as a user and set up the integration with LaunchDarkly or any other flag provider or adapter.

Note: This is not needed when using the memory-adapter.

```jsx
import { adapter } from "@flopflip/launchdarkly-adapter";

<ConfigureFlopFlip
  adapter={adapter}
  adapterArgs={{ sdk: { clientSideId }, context }}
>
  <App />
</ConfigureFlopFlip>;
```

### Reconfiguring adapters

Whenever your application "gains" certain information (e.g. with `react-router`) only further
down the tree but that information should be used for user targeting (through `adapterArgs.context` for LaunchDarkly or `adapterArgs.user` for other adapters) you
can use `ReconfigureFlopFlip`. `ReconfigureFlopFlip` itself communicates with `ConfigureFlopFlip`
to reconfigure the given adapter for more fine grained targeting with the passed context.
You also do not have to worry about rendering any number of `ReconfigureFlopFlip`s before the adapter is
initialized (e.g. LaunchDarkly). Requested reconfigurations will be queued and processed once the adapter is configured.

Imagine having `ConfigureFlopFlip` above a given component wrapped by a `Route`:

```jsx
<ConfigureFlopFlip
  adapter={adapter}
  adapterArgs={{ sdk: { clientSideId }, context }}
>
  <>
    <SomeOtherAppComponent />
    <Route
      exact={false}
      path="/:projectKey"
      render={(routerProps) => (
        <>
          <MyRouteComponent />
          <ReconfigureFlopFlip
            // Note: This is the default - feel free to omit unless you want to set it to `true`.
            shouldOverwrite={false}
            // Note: this should be memoised to not trigger wasteful `reconfiguration`s.
            user={{ projectKey: routerProps.projectKey }}
          />
        </>
      )}
    />
  </>
</ConfigureFlopFlip>
```

Internally, `ReconfigureFlopFlip` will pass the `projectKey` to `ConfigureFlopFlip`, causing the adapter to automatically update the context and therefore to flush new flags from the adapter (given they are provided by e.g. LaunchDarkly).

> **Note:** Whenever `shouldOverwrite` is `true` the existing configuration will be overwritten not merged. Use with care as any subsequent `shouldOverwrite={true}` will overwrite any previously passed properties with `shouldOverwrite={false}` (default).

## ❯ Adapters

All adapters are configured through the `adapterArgs` prop of `ConfigureFlopFlip`. Most adapters accept a `user: TUser` with an optional `key` of type string to identify a user uniquely.

The `ConfigureFlopFlip` component accepts the following props:

- `adapter` -- the adapter to use (e.g. `launchdarkly-adapter`)
  - An `adapter` should implement the `configure` and `reconfigure` methods, which both must return a `Promise` as configuration can be asynchronous
- `adapterArgs` -- whatever the underlying `adapter` accepts
  - The `adapter` will receive `onFlagsStateChange` and `onStatusStateChange` which should be invoked accordingly to notify `react-broadcast` and `react-redux` about flag and status changes
- `shouldDeferAdapterConfiguration` -- defer initial adapter configuration (useful when waiting for a `key` to be present)
- `defaultFlags` -- default flag values until an `adapter` responds or in case flags were removed
- Adapters expose `adapter.updateFlags` to update flags explicitly, flushing them to all components via `react-broadcast` or `react-redux`

#### LaunchDarkly adapter

> **Note:** The LaunchDarkly adapter uses `context: LDContext` instead of `user`.

- `context` -- the LaunchDarkly context (`LDContext`) used to identify the user
- `sdk.clientSideId` -- the client side id of LaunchDarkly
- `sdk.clientOptions` -- additional options to be passed to the underlying SDK
- `flags` -- defaulting to `null` to subscribe only to specific flags. Helpful when not wanting to subscribe to all flags to utilise LaunchDarkly's automatic flag archiving functionality
- `cacheMode` -- defaulting to `null` to change application of cached flags
  - `eager` -- remote values should have effect immediately
  - `lazy` -- values should be updated in the cache but only be applied once the adapter is configured again
- `throwOnInitializationFailure` -- defaulting to `false` to indicate if the adapter should re-throw an error during initialization
- `flagsUpdateDelayMs` -- defaulting to `0` to debounce the flag update subscription
- `initializationTimeout` -- defaulting to `2` (seconds) to set the timeout for `waitForInitialization`

#### Split.io adapter

- `sdk.authorizationKey` -- authorization key for splitio
- `sdk.options` -- general attributes passed to splitio SDK
- `sdk.treatmentAttributes` -- the treatment attributes passed to splitio

#### GraphQL adapter

- `uri` -- the URI to the GraphQL endpoint (e.g. `https://graphql.com/graphql`)
- `query` -- the GraphQL query which returns features (e.g. `query AllFeatures { flags: allFeatures { name \n value} }`)
- `getQueryVariables` -- a function called with `adapterArgs` returning variables for your GraphQL query
- `getRequestHeaders` -- a function called with `adapterArgs` returning headers for your GraphQL request
- `parseFlags` -- a function called with the `data` of fetched flags to parse the result into the `TFlags` type
- `fetcher` -- a fetch implementation if you prefer to not rely on the global `fetch`
- `pollingIntervalMs` -- the polling interval to check for updated flag values (defaults to 60000ms)

#### HTTP adapter

- `execute` -- a function called with `adapterArgs` which must return a `Promise` resolving to flags
- `pollingIntervalMs` -- the polling interval in milliseconds (defaults to 60000ms)

#### LocalStorage adapter

- `pollingIntervalMs` -- an interval at which the adapter polls for new flags from localstorage in milliseconds (defaults to 60000ms)

#### Memory adapter

No special configuration is required for the memory adapter.

## ❯ API Reference

Both `@flopflip/react-broadcast` and `@flopflip/react-redux` export the same set
of hooks, components, and HoCs. Only the import changes depending on if you chose
to integrate with redux or without. Behind the scenes they build on
`@flopflip/react` to share common logic.

> **Flag normalization:** All `flag` names are strings. Depending on the adapter used, these are normalized to camelCase. A `foo-flag-name` received from e.g. LaunchDarkly or splitio will be converted to `fooFlagName`. The same applies for `foo_flag_name`. This is meant to help using flags in an adapter-agnostic way. Whenever a flag is passed in non-normalized form it is also normalized again. `flopflip` will show a warning message in the console in development mode whenever a non-normalized flag name is passed.

### Hooks

#### `useFeatureToggle(flagName: string, flagVariation: FlagVariation): boolean`

Read a single flag's toggle state:

```jsx
import { useFeatureToggle } from "@flopflip/react-broadcast";

const ComponentWithFeatureToggle = (props) => {
  const isFeatureEnabled = useFeatureToggle("myFeatureToggle");

  return (
    <h3>{props.title}</h3>
    <p>The feature is {isFeatureEnabled ? "enabled" : "disabled"}</p>
  );
};
```

#### `useFeatureToggles({ [flagName: string]: FlagVariation }): boolean[]`

Read multiple flags at once:

```jsx
import { useFeatureToggles } from "@flopflip/react-broadcast";

const ComponentWithFeatureToggles = (props) => {
  const [isFirstFeatureEnabled, isV2SignUpEnabled] = useFeatureToggles({
    myFeatureToggle: true,
    mySignUpVariation: "signUpV2",
  });

  return (
    <h3>{props.title}</h3>
    <p>The first feature is {isFirstFeatureEnabled ? "enabled" : "disabled"}</p>
    <p>The v2 signup feature is {isV2SignUpEnabled ? "enabled" : "disabled"}</p>
  );
};
```

#### `useFlagVariation(flagName: string): FlagVariation`

Read a single flag's variation value:

```jsx
import { useFlagVariation } from "@flopflip/react-broadcast";

const ComponentWithFeatureToggle = (props) => {
  const featureVariation = useFlagVariation("myFeatureToggle");

  return (
    <h3>{props.title}</h3>
    <p>The feature variation is {featureVariation}</p>
  );
};
```

#### `useFlagVariations([flagName: string]): FlagVariation[]`

Read multiple flag variation values at once:

```jsx
import { useFlagVariations } from "@flopflip/react-broadcast";

const ComponentWithFeatureToggle = (props) => {
  const [featureVariation1, featureVariation2] = useFlagVariations([
    "myFeatureToggle1",
    "myFeatureToggle2",
  ]);

  return (
    <h3>{props.title}</h3>
    <ul>
      <li>The feature variation 1 is {featureVariation1}</li>
      <li>The feature variation 2 is {featureVariation2}</li>
    </ul>
  );
};
```

#### `useAdapterStatus(): AdapterStatus`

Read the underlying adapter's status:

```jsx
import { useAdapterStatus } from "@flopflip/react-broadcast";

const ComponentWithFeatureToggle = () => {
  const isFeatureEnabled = useFeatureToggle("myFeatureToggle");
  const { isConfigured } = useAdapterStatus();

  if (!isConfigured) return <LoadingSpinner />;
  else if (!isFeatureEnabled) return <PageNotFound />;
  else return <FeatureComponent />;
};
```

#### `useAdapterReconfiguration()`

Reconfigure the adapter with new properties (either merged or overwriting old properties).

#### `useAllFeatureToggles()`

Read all feature toggles at once.

### Components

#### `ConfigureFlopFlip`

See the [Getting Started](#-getting-started) section for usage.

#### `ReconfigureFlopFlip`

See [Reconfiguring adapters](#reconfiguring-adapters) for usage.

#### `ToggleFeature`

The component renders its `children` depending on the state of a given feature
flag. It also allows passing an optional `untoggledComponent` which will be
rendered whenever the feature is disabled instead of `null`.

```jsx
import { ToggleFeature } from "@flopflip/react-redux";
// or import { ToggleFeature } from '@flopflip/react-broadcast';
import { flagsNames } from "./feature-flags";

const UntoggledComponent = () => <h3>{"At least there is a fallback!"}</h3>;
export default (
  <ToggleFeature
    flag={flagsNames.THE_FEATURE_TOGGLE}
    untoggledComponent={UntoggledComponent}
  >
    <h3>I might be gone or there!</h3>
  </ToggleFeature>
);
```

For multi-variate feature toggles, pass a `variation` prop:

```jsx
<ToggleFeature
  flag={flagsNames.THE_FEATURE_TOGGLE.NAME}
  variation={flagsNames.THE_FEATURE_TOGGLE.VARIATES.A}
  untoggledComponent={UntoggledComponent}
>
  <h3>I might be gone or there!</h3>
</ToggleFeature>
```

`ToggleFeature` supports several rendering patterns:

| Pattern | Description |
| --- | --- |
| `children` (element) | Rendered when the feature is enabled |
| `children` (function) | Called with `{ isFeatureEnabled }` -- always invoked |
| `render` (function) | Called only when the feature is enabled |
| `toggledComponent` | Component rendered when the feature is enabled |
| `untoggledComponent` | Component rendered when the feature is disabled |

Example with `toggledComponent` prop:

```jsx
const UntoggledComponent = () => <h3>{"At least there is a fallback!"}</h3>;
const ToggledComponent = () => <h3>{"I might be gone or there!"}</h3>;

export default (
  <ToggleFeature
    flag={flagsNames.THE_FEATURE_TOGGLE.NAME}
    variation={flagsNames.THE_FEATURE_TOGGLE.VARIATES.A}
    untoggledComponent={UntoggledComponent}
    toggledComponent={ToggledComponent}
  />
);
```

Example with Function as a Child (FaaC):

```jsx
<ToggleFeature
  flag={flagsNames.THE_FEATURE_TOGGLE.NAME}
  variation={flagsNames.THE_FEATURE_TOGGLE.VARIATES.A}
  untoggledComponent={UntoggledComponent}
>
  {({ isFeatureEnabled }) => <h3>I might be gone or there!</h3>}
</ToggleFeature>
```

Example with `render` prop (only invoked when the feature is on):

```jsx
<ToggleFeature
  flag={flagsNames.THE_FEATURE_TOGGLE.NAME}
  variation={flagsNames.THE_FEATURE_TOGGLE.VARIATES.A}
  untoggledComponent={UntoggledComponent}
  render={() => <h3>I might be gone or there!</h3>}
/>
```

> We recommend maintaining a list of constants with feature flag names somewhere within your application. This avoids typos and unexpected behavior. After all, the correct workings of your feature flags is crucial to your application.

#### `TestProviderFlopFlip`

Exported from `@flopflip/react-broadcast` only. A test provider component for testing feature flag behaviour in your tests.

### Higher-Order Components

#### `branchOnFeatureToggle({ flag: String, variation?: String | Boolean })`

A HoC to conditionally render a component based on a feature toggle's state. It
accepts the feature toggle name and an optional component to be rendered in case
the feature is disabled.

Without a component rendered in place of the `ComponentToBeToggled`:

```jsx
import { branchOnFeatureToggle } from "@flopflip/react-redux";
import flagsNames from "./feature-flags";

const ComponentToBeToggled = () => <h3>I might be gone or there!</h3>;

export default branchOnFeatureToggle({ flag: flagsNames.THE_FEATURE_TOGGLE })(
  ComponentToBeToggled
);
```

With a component rendered in place of the `ComponentToBeToggled`:

```jsx
import { branchOnFeatureToggle } from "@flopflip/react-redux";
import { flagsNames } from "./feature-flags";

const ComponentToBeToggled = () => <h3>I might be gone or there!</h3>;
const ComponentToBeRenderedInstead = () => (
  <h3>At least there is a fallback!</h3>
);

export default branchOnFeatureToggle(
  { flag: flagsNames.THE_FEATURE_TOGGLE },
  ComponentToBeRenderedInstead
)(ComponentToBeToggled);
```

With a multi-variate flag:

```jsx
import { branchOnFeatureToggle } from "@flopflip/react-redux";
import { flagsNames } from "./feature-flags";

const ComponentToBeToggled = () => <h3>I might be gone or there!</h3>;
const ComponentToBeRenderedInstead = () => (
  <h3>At least there is a fallback!</h3>
);

export default branchOnFeatureToggle(
  {
    flag: flagsNames.THE_FEATURE_TOGGLE,
    variation: "variate1",
  },
  ComponentToBeRenderedInstead
)(ComponentToBeToggled);
```

#### `injectFeatureToggles(flagNames: Array<String>, propKey?: String, areOwnPropsEqual?: Function)`

This HoC matches feature toggles given against configured ones and injects the
matching result.

```jsx
import { injectFeatureToggles } from "@flopflip/react-redux";
import { flagsNames } from "./feature-flags";

const Component = (props) => {
  if (props.featureToggles[flagsNames.TOGGLE_A])
    return <h3>Something to render!</h3>;
  else if (props.featureToggles[flagsNames.TOGGLE_B])
    return <h3>Something else to render!</h3>;

  return <h3>Something different to render!</h3>;
};

export default injectFeatureToggles([flagsNames.TOGGLE_A, flagsNames.TOGGLE_B])(
  Component
);
```

#### `injectFeatureToggle(flag: String, propKey?: String)`

This HoC matches feature toggles given against configured ones and injects the
matching result. `branchOnFeatureToggle` uses this to conditionally render a
component. You also may pass a second argument to overwrite the default
`propKey` of the injected toggle (defaults to `isFeatureEnabled`).

```jsx
import { injectFeatureToggle } from "@flopflip/react-redux";
import { flagsNames } from "./feature-flags";

const Component = (props) => {
  if (props.isFeatureEnabled) return <h3>Something to render!</h3>;

  return <h3>Something different to render!</h3>;
};

export default injectFeatureToggle(flagsNames.TOGGLE_B)(Component);
```

The feature flags will be available as `props` within the component allowing
some custom decisions based on their value.

### Redux API (react-redux only)

#### `flopflipReducer` / `createFlopflipReducer`

The reducer for the feature toggle state. See [Using react-redux](#using-react-redux-redux) and [Setup through a Redux store enhancer](#setup-through-a-redux-store-enhancer) for usage.

#### `FLOPFLIP_STATE_SLICE`

The state slice key used for the feature toggle state in the Redux store.

#### `createFlopFlipEnhancer`

Requires two arguments:

- The `adapter` (e.g. imported from `@flopflip/launchdarkly-adapter`)
- The `adapterArgs` object containing the adapter-specific configuration
  (e.g. `{ sdk: { clientSideId }, context }` for LaunchDarkly)

#### `selectFeatureFlag` / `selectFeatureFlags`

Selectors to access feature toggle(s) directly from the Redux store, so
that the use of `injectFeatureToggle` or `injectFeatureToggles` is not enforced.
They return the same values for flags as `injectFeatureToggle` and `injectFeatureToggles` would.

```jsx
import { selectFeatureFlag } from "@flopflip/react-redux";

const mapStateToProps = (state) => ({
  someOtherState: state.someOtherState,
  isFeatureOn: selectFeatureFlag("fooFlagName")(state),
});

export default connect(mapStateToProps)(FooComponent);
```

As an alternative to using `injectFeatureToggle`:

```jsx
const mapStateToProps = (state) => ({
  someOtherState: state.someOtherState,
});

export default compose(
  injectFeatureToggle("fooFlagName"),
  connect(mapStateToProps)
)(FooComponent);
```

The same pattern applies for `selectFeatureFlags`.

## ❯ Cypress Plugin

Changing flag state in End-to-End test runs helps ensuring that an application works as expected with all variations of a feature. For this `@flopflip` comes with a `cypress-plugin`. This plugin tightly integrates with any underlying adapter and allows altering flag state from within test runs.

Imagine having the following Cypress test suite:

```jsx
describe("adding users", () => {
  describe("with searching by E-Mail being enabled", () => {
    it("should allow adding users by E-Mail", () => {
      cy.updateFeatureFlags({ searchUsersByEmail: true });

      //... expectations
    });
  });
  describe("with searching by E-Mail being disabled", () => {
    it("should allow adding users by name", () => {
      cy.updateFeatureFlags({ searchUsersByEmail: false });

      //... expectations
    });
  });
});
```

In the example above we test two variations of a feature. Being able to alter flag state during test runs avoids work-arounds such as complex multi-project setups and makes the tests themselves resilient to changes of your flag configurations on your staging or testing environments.

### Installation

To install the `@flopflip/cypress-plugin` you will have to add the respective command and plugin as follows after installing it as a `devDependency`.

```bash
yarn add --dev @flopflip/cypress-plugin
npm install --save-dev @flopflip/cypress-plugin
```

In the `plugins/index.js` add the following to your existing config:

```diff
+const flopflipCypressPlugin = require('@flopflip/cypress-plugin');

module.exports = (on, cypressConfig) => {

+flopflipCypressPlugin.install(on);

  return { };
};
```

In the `support/index.js` add the following to your existing commands:

```jsx
import { addCommands as addFlopflipCommands } from "@flopflip/cypress-plugin";

addFlopflipCommands({
  adapterId: "launchdarkly",
});
```

Please note that the `adapterId` should be one of `launchdarkly`, `memory`, `localstorage`, `splitio`, `graphql` or `http`. It allows the `cypress-plugin` to hook into the respective adapter. Also make sure to update to the most recent version of any adapter to ensure a smooth integration between the plugin and the adapter.

## ❯ Module Formats

All packages are built for ESM and CommonJS using
[`tsup`](https://github.com/egoist/tsup) (powered by esbuild).

The `package.json` files contain a `main` entry pointing to `./dist/index.js`
and an `exports` map with `import` and `require` conditions:

- ESM: `./dist/index.js`
- CommonJS: `./dist/index.cjs`

All build files are part of the npm distribution using the
[`files`](https://github.com/tdeekens/flopflip/blob/main/packages/react-redux/package.json)
array to keep install time short.

## ❯ Browser Support

Configured via `.browserslistrc`:

```
[production]
supports es6-module and >0.25%
not ie 11
not op_mini all

[ssr]
node 12
```

Run `npx browserslist` to see the resolved browser list for the current environment.

<!-- Badge link definitions -->

[types-latest-version]: https://flat.badgen.net/npm/v/@flopflip/types
[types-next-version]: https://flat.badgen.net/npm/v/@flopflip/types
[types-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/types
[types-next-icon]: https://flat.badgen.net/npm/v/@flopflip/types/next
[types-downloads]: https://flat.badgen.net/npm/dm/@flopflip/types
[types-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/types
[splitio-adapter-latest-version]: https://flat.badgen.net/npm/v/@flopflip/splitio-adapter
[splitio-adapter-next-version]: https://flat.badgen.net/npm/v/@flopflip/splitio-adapter
[splitio-adapter-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/splitio-adapter
[splitio-adapter-next-icon]: https://flat.badgen.net/npm/v/@flopflip/splitio-adapter/next
[splitio-adapter-downloads]: https://flat.badgen.net/npm/dm/@flopflip/splitio-adapter
[splitio-adapter-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/splitio-adapter
[launchdarkly-adapter-latest-version]: https://flat.badgen.net/npm/v/@flopflip/launchdarkly-adapter
[launchdarkly-adapter-next-version]: https://flat.badgen.net/npm/v/@flopflip/launchdarkly-adapter
[launchdarkly-adapter-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/launchdarkly-adapter
[launchdarkly-adapter-next-icon]: https://flat.badgen.net/npm/v/@flopflip/launchdarkly-adapter/next
[launchdarkly-adapter-downloads]: https://flat.badgen.net/npm/dm/@flopflip/launchdarkly-adapter
[launchdarkly-adapter-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/launchdarkly-adapter
[memory-adapter-latest-version]: https://flat.badgen.net/npm/v/@flopflip/memory-adapter
[memory-adapter-next-version]: https://flat.badgen.net/npm/v/@flopflip/memory-adapter
[memory-adapter-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/memory-adapter
[memory-adapter-next-icon]: https://flat.badgen.net/npm/v/@flopflip/memory-adapter/next
[memory-adapter-downloads]: https://flat.badgen.net/npm/dm/@flopflip/memory-adapter
[memory-adapter-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/memory-adapter
[localstorage-adapter-latest-version]: https://flat.badgen.net/npm/v/@flopflip/localstorage-adapter
[localstorage-adapter-next-version]: https://flat.badgen.net/npm/v/@flopflip/localstorage-adapter
[localstorage-adapter-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/localstorage-adapter
[localstorage-adapter-next-icon]: https://flat.badgen.net/npm/v/@flopflip/localstorage-adapter/next
[localstorage-adapter-downloads]: https://flat.badgen.net/npm/dm/@flopflip/localstorage-adapter
[localstorage-adapter-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/localstorage-adapter
[graphql-adapter-latest-version]: https://flat.badgen.net/npm/v/@flopflip/graphql-adapter
[graphql-adapter-next-version]: https://flat.badgen.net/npm/v/@flopflip/graphql-adapter
[graphql-adapter-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/graphql-adapter
[graphql-adapter-next-icon]: https://flat.badgen.net/npm/v/@flopflip/graphql-adapter/next
[graphql-adapter-downloads]: https://flat.badgen.net/npm/dm/@flopflip/graphql-adapter
[graphql-adapter-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/graphql-adapter
[react-latest-version]: https://flat.badgen.net/npm/v/@flopflip/react
[react-next-version]: https://flat.badgen.net/npm/v/@flopflip/react
[react-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/react
[react-next-icon]: https://flat.badgen.net/npm/v/@flopflip/react/next
[react-downloads]: https://flat.badgen.net/npm/dm/@flopflip/react
[react-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/react
[react-broadcast-latest-version]: https://flat.badgen.net/npm/v/@flopflip/react-broadcast
[react-broadcast-next-version]: https://flat.badgen.net/npm/v/@flopflip/react-broadcast
[react-broadcast-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/react-broadcast
[react-broadcast-next-icon]: https://flat.badgen.net/npm/v/@flopflip/react-broadcast/next
[react-broadcast-downloads]: https://flat.badgen.net/npm/dm/@flopflip/react-broadcast
[react-broadcast-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/react-broadcast
[react-redux-latest-version]: https://flat.badgen.net/npm/v/@flopflip/react-redux
[react-redux-next-version]: https://flat.badgen.net/npm/v/@flopflip/react-redux
[react-redux-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/react-redux
[react-redux-next-icon]: https://flat.badgen.net/npm/v/@flopflip/react-redux/next
[react-redux-downloads]: https://flat.badgen.net/npm/dm/@flopflip/react-redux
[react-redux-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/react-redux
[cypress-plugin-latest-version]: https://flat.badgen.net/npm/v/@flopflip/cypress-plugin
[cypress-plugin-next-version]: https://flat.badgen.net/npm/v/@flopflip/cypress-plugin
[cypress-plugin-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/cypress-plugin
[cypress-plugin-next-icon]: https://flat.badgen.net/npm/v/@flopflip/cypress-plugin/next
[cypress-plugin-downloads]: https://flat.badgen.net/npm/dm/@flopflip/cypress-plugin
[cypress-plugin-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/cypress-plugin
[http-adapter-latest-version]: https://flat.badgen.net/npm/v/@flopflip/http-adapter
[http-adapter-next-version]: https://flat.badgen.net/npm/v/@flopflip/http-adapter
[http-adapter-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/http-adapter
[http-adapter-next-icon]: https://flat.badgen.net/npm/v/@flopflip/http-adapter/next
[http-adapter-downloads]: https://flat.badgen.net/npm/dm/@flopflip/http-adapter
[http-adapter-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/http-adapter
[combine-adapters-latest-version]: https://flat.badgen.net/npm/v/@flopflip/combine-adapters
[combine-adapters-next-version]: https://flat.badgen.net/npm/v/@flopflip/combine-adapters
[combine-adapters-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/combine-adapters
[combine-adapters-next-icon]: https://flat.badgen.net/npm/v/@flopflip/combine-adapters/next
[combine-adapters-downloads]: https://flat.badgen.net/npm/dm/@flopflip/combine-adapters
[combine-adapters-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/combine-adapters
