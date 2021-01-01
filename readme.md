<p align="center">
  <img alt="Logo" src="https://raw.githubusercontent.com/tdeekens/flopflip/master/logo.png" width="250" /><br /><br />
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
  · Jest
  · Prettier
  · TypeScript
  · @testing-library/react
  · ESLint
  · Babel
  · Lodash
  · Changesets
  · Rollup
  🙏
  </sub>
</p>

<p align="center">
  <a href="https://github.com/tdeekens/flopflip/actions?query=workflow%3A%22Test+and+Build%22">
    <img alt="GitHub Action Status" src="https://github.com/tdeekens/flopflip/workflows/test/badge.svg
">
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

  <img alt="Logo" src="https://raw.githubusercontent.com/tdeekens/flopflip/master/demo.gif" />
  <br /><br />
</details>

## ❯ Why you might use this.

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
  const isFeatureEnabled = useFeatureToggle('featureFlagName');
  const handleClick = () => console.log('🦄');

  return (
    <button disabled={!isFeatureEnabled} onClick={handleClick}>
      Try out feature
    </button>
  );
};
```

In all examples flags will update in realtime (depending on the adapter and provider) and the User Interface will update accordingly. If this sounds interesting to you, keep reading.

## ❯ Browser support

| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Opera | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari-ios.png" alt="iOS Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome-android.png" alt="Chrome for Android" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome for Android |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                             | last 2 versions                                                                                                                                                                                                       | last 2 versions                                                                                                                                                                                                    | last 2 versions                                                                                                                                                                                                    | last 2 versions                                                                                                                                                                                                 | last 2 versions                                                                                                                                                                                                                | last version                                                                                                                                                                                                                                       |

## ❯ Package Status

| Package                                                  | Version                                                                                                                                                                                                       | Dependencies                                                                                                             | Downloads                                                                                           | Sizes                                                                                              |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [`react`](/packages/react)                               | [![react Version][react-latest-icon]][react-latest-version] [![react Version][react-next-icon]][react-next-version]                                                                                           | [![react Dependencies Status][react-dependencies-icon]][react-dependencies]                                              | [![react Downloads][react-downloads]][react-downloads]                                              | [![react Minified + GZipped][react-size]][react-size]                                              |
| [`react-broadcast`](/packages/react-broadcast)           | [![react-broadcast Version][react-broadcast-latest-icon]][react-broadcast-latest-version] [![react-broadcast Version][react-broadcast-next-icon]][react-broadcast-next-version]                               | [![react-broadcast Dependencies Status][react-broadcast-dependencies-icon]][react-broadcast-dependencies]                | [![react-broadcast Downloads][react-broadcast-downloads]][react-broadcast-downloads]                | [![react-broadcast Minified + GZipped][react-broadcast-size]][react-broadcast-size]                |
| [`react-redux`](/packages/react-redux)                   | [![react-redux Version][react-redux-latest-icon]][react-redux-latest-version] [![react-redux Version][react-redux-next-icon]][react-redux-next-version]                                                       | [![react-redux Dependencies Status][react-redux-dependencies-icon]][react-redux-dependencies]                            | [![react-redux Downloads][react-redux-downloads]][react-redux-downloads]                            | [![react-redux Minified + GZipped][react-redux-size]][react-redux-size]                            |
| [`launchdarkly-adapter`](/packages/launchdarkly-adapter) | [![launchdarkly-adapter Version][launchdarkly-adapter-latest-icon]][launchdarkly-adapter-latest-version] [![launchdarkly-adapter Version][launchdarkly-adapter-next-icon]][launchdarkly-adapter-next-version] | [![launchdarkly-adapter Dependencies Status][launchdarkly-adapter-dependencies-icon]][launchdarkly-adapter-dependencies] | [![launchdarkly-adapter Downloads][launchdarkly-adapter-downloads]][launchdarkly-adapter-downloads] | [![launchdarkly-adapter Minified + GZipped][launchdarkly-adapter-size]][launchdarkly-adapter-size] |
| [`splitio-adapter`](/packages/splitio-adapter)           | [![splitio-adapter Version][splitio-adapter-latest-icon]][splitio-adapter-latest-version] [![splitio-adapter Version][splitio-adapter-next-icon]][splitio-adapter-next-version]                               | [![splitio-adapter Dependencies Status][splitio-adapter-dependencies-icon]][splitio-adapter-dependencies]                | [![splitio-adapter Downloads][splitio-adapter-downloads]][splitio-adapter-downloads]                | [![splitio-adapter Minified + GZipped][splitio-adapter-size]][splitio-adapter-size]                |
| [`memory-adapter`](/packages/memory-adapter)             | [![memory-adapter Version][memory-adapter-latest-icon]][memory-adapter-latest-version] [![memory-adapter Version][memory-adapter-next-icon]][memory-adapter-next-version]                                     | [![memory-adapter Dependencies Status][memory-adapter-dependencies-icon]][memory-adapter-dependencies]                   | [![memory-adapter Downloads][memory-adapter-downloads]][memory-adapter-downloads]                   | [![memory-adapter Minified + GZipped][memory-adapter-size]][memory-adapter-size]                   |
| [`localstorage-adapter`](/packages/localstorage-adapter) | [![localstorage-adapter Version][localstorage-adapter-latest-icon]][localstorage-adapter-latest-version] [![localstorage-adapter Version][localstorage-adapter-next-icon]][localstorage-adapter-next-version] | [![localstorage-adapter Dependencies Status][localstorage-adapter-dependencies-icon]][localstorage-adapter-dependencies] | [![localstorage-adapter Downloads][localstorage-adapter-downloads]][localstorage-adapter-downloads] | [![localstorage-adapter Minified + GZipped][localstorage-adapter-size]][localstorage-adapter-size] |
| [`graphql-adapter`](/packages/graphql-adapter)           | [![graphql-adapter Version][graphql-adapter-latest-icon]][graphql-adapter-latest-version] [![graphql-adapter Version][graphql-adapter-next-icon]][graphql-adapter-next-version]                               | [![graphql-adapter Dependencies Status][graphql-adapter-dependencies-icon]][graphql-adapter-dependencies]                | [![graphql-adapter Downloads][graphql-adapter-downloads]][graphql-adapter-downloads]                | [![graphql-adapter Minified + GZipped][graphql-adapter-size]][graphql-adapter-size]                |
| [`cypress-plugin`](/packages/cypress-plugin)             | [![cypress-plugin Version][cypress-plugin-latest-icon]][cypress-plugin-latest-version] [![cypress-plugin Version][cypress-plugin-next-icon]][cypress-plugin-next-version]                                     | [![cypress-plugin Dependencies Status][cypress-plugin-dependencies-icon]][cypress-plugin-dependencies]                   | [![cypress-plugin Downloads][cypress-plugin-downloads]][cypress-plugin-downloads]                   | [![cypress-plugin Minified + GZipped][localstorage-adapter-size]][localstorage-adapter-size]       |
| [`types`](/packages/types)                               | [![types Version][types-latest-icon]][types-latest-version] [![types Version][types-next-icon]][types-next-version]                                                                                           | [![types Dependencies Status][types-dependencies-icon]][types-dependencies]                                              | [![types Downloads][types-downloads]][types-downloads]                                              | [![types Minified + GZipped][types-size]][types-size]                                              |

[types-latest-version]: https://flat.badgen.net/npm/v/@flopflip/types
[types-next-version]: https://flat.badgen.net/npm/v/@flopflip/types
[types-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/types
[types-next-icon]: https://flat.badgen.net/npm/v/@flopflip/types/next
[types-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/types
[types-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&
[types-downloads]: https://flat.badgen.net/npm/dm/@flopflip/types
[types-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/types
[splitio-adapter-latest-version]: https://flat.badgen.net/npm/v/@flopflip/splitio-adapter
[splitio-adapter-next-version]: https://flat.badgen.net/npm/v/@flopflip/splitio-adapter
[splitio-adapter-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/splitio-adapter
[splitio-adapter-next-icon]: https://flat.badgen.net/npm/v/@flopflip/splitio-adapter/next
[splitio-adapter-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/splitio-adapter
[splitio-adapter-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/splitio-adapter
[splitio-adapter-downloads]: https://flat.badgen.net/npm/dm/@flopflip/splitio-adapter
[splitio-adapter-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/splitio-adapter
[launchdarkly-adapter-latest-version]: https://flat.badgen.net/npm/v/@flopflip/launchdarkly-adapter
[launchdarkly-adapter-next-version]: https://flat.badgen.net/npm/v/@flopflip/launchdarkly-adapter
[launchdarkly-adapter-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/launchdarkly-adapter
[launchdarkly-adapter-next-icon]: https://flat.badgen.net/npm/v/@flopflip/launchdarkly-adapter/next
[launchdarkly-adapter-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/launchdarkly-adapter
[launchdarkly-adapter-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/launchdarkly-adapter
[launchdarkly-adapter-downloads]: https://flat.badgen.net/npm/dm/@flopflip/launchdarkly-adapter
[launchdarkly-adapter-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/launchdarkly-adapter
[memory-adapter-latest-version]: https://flat.badgen.net/npm/v/@flopflip/memory-adapter
[memory-adapter-next-version]: https://flat.badgen.net/npm/v/@flopflip/memory-adapter
[memory-adapter-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/memory-adapter
[memory-adapter-next-icon]: https://flat.badgen.net/npm/v/@flopflip/memory-adapter/next
[memory-adapter-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/memory-adapter
[memory-adapter-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/memory-adapter
[memory-adapter-downloads]: https://flat.badgen.net/npm/dm/@flopflip/memory-adapter
[memory-adapter-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/memory-adapter
[localstorage-adapter-latest-version]: https://flat.badgen.net/npm/v/@flopflip/localstorage-adapter
[localstorage-adapter-next-version]: https://flat.badgen.net/npm/v/@flopflip/localstorage-adapter
[localstorage-adapter-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/localstorage-adapter
[localstorage-adapter-next-icon]: https://flat.badgen.net/npm/v/@flopflip/localstorage-adapter/next
[localstorage-adapter-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/localstorage-adapter
[localstorage-adapter-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/localstorage-adapter
[localstorage-adapter-downloads]: https://flat.badgen.net/npm/dm/@flopflip/localstorage-adapter
[localstorage-adapter-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/localstorage-adapter
[graphql-adapter-latest-version]: https://flat.badgen.net/npm/v/@flopflip/graphql-adapter
[graphql-adapter-next-version]: https://flat.badgen.net/npm/v/@flopflip/graphql-adapter
[graphql-adapter-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/graphql-adapter
[graphql-adapter-next-icon]: https://flat.badgen.net/npm/v/@flopflip/graphql-adapter/next
[graphql-adapter-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/graphql-adapter
[graphql-adapter-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/graphql-adapter
[graphql-adapter-downloads]: https://flat.badgen.net/npm/dm/@flopflip/graphql-adapter
[graphql-adapter-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/graphql-adapter
[react-latest-version]: https://flat.badgen.net/npm/v/@flopflip/react
[react-next-version]: https://flat.badgen.net/npm/v/@flopflip/react
[react-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/react
[react-next-icon]: https://flat.badgen.net/npm/v/@flopflip/react/next
[react-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/react
[react-downloads]: https://flat.badgen.net/npm/dm/@flopflip/react
[react-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/react
[react-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/react
[react-broadcast-latest-version]: https://flat.badgen.net/npm/v/@flopflip/react-broadcast
[react-broadcast-next-version]: https://flat.badgen.net/npm/v/@flopflip/react-broadcast
[react-broadcast-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/react-broadcast
[react-broadcast-next-icon]: https://flat.badgen.net/npm/v/@flopflip/react-broadcast/next
[react-broadcast-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/react-broadcast
[react-broadcast-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/react-broadcast
[react-broadcast-downloads]: https://flat.badgen.net/npm/dm/@flopflip/react-broadcast
[react-broadcast-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/react-broadcast
[react-redux-latest-version]: https://flat.badgen.net/npm/v/@flopflip/react-redux
[react-redux-next-version]: https://flat.badgen.net/npm/v/@flopflip/react-redux
[react-redux-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/react-redux
[react-redux-next-icon]: https://flat.badgen.net/npm/v/@flopflip/react-redux/next
[react-redux-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/react-redux
[react-redux-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/react-redux
[react-redux-downloads]: https://flat.badgen.net/npm/dm/@flopflip/react-redux
[react-redux-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/react-redux
[cypress-plugin-latest-version]: https://flat.badgen.net/npm/v/@flopflip/cypress-plugin
[cypress-plugin-next-version]: https://flat.badgen.net/npm/v/@flopflip/cypress-plugin
[cypress-plugin-latest-icon]: https://flat.badgen.net/npm/v/@flopflip/cypress-plugin
[cypress-plugin-next-icon]: https://flat.badgen.net/npm/v/@flopflip/cypress-plugin/next
[cypress-plugin-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/cypress-plugin
[cypress-plugin-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/cypress-plugin
[cypress-plugin-downloads]: https://flat.badgen.net/npm/dm/@flopflip/cypress-plugin
[cypress-plugin-size]: https://flat.badgen.net/bundlephobia/minzip/@flopflip/cypress-plugin

## ❯ Installation

This is a mono repository maintained using
[changesets](https://github.com/atlassian/changesets). It currently contains five
[packages](/packages) in a `memory-adapter`, a `localstorage-adapter` or
`launchdarkly-adapter`, `react`, `react-redux` and `react-broadcast`. You should
not need the `launchdarkly-adapter` yourself but one of our bindings
(react-broadcast or react-redux). Both use the `react` package to share
components.

Depending on the preferred integration (with or without redux) use:

`yarn add @flopflip/react-redux` or `npm i @flopflip/react-redux --save`

or

`yarn add @flopflip/react-broadcast` or `npm i @flopflip/react-broadcast --save`

## ❯ Demo

A minimal [demo](/demo) exists and can be adjusted to point to a
[custom](https://github.com/tdeekens/flopflip/blob/master/demo/src/App.js#L108)
LaunchDarkly account. You would have to create feature toggles according to the
existing
[flags](https://github.com/tdeekens/flopflip/blob/master/demo/src/flags.js),
though.

Then simply run:

1.  From the repositories root: `yarn build:watch`
2.  From `/demo`: first `yarn` and then `yarn start`

A browser window should open and the network tab should show feature flags being
loaded from LaunchDarkly.

## ❯ Documentation

Flopflip allows you to manage feature flags through the notion of adapters (e.g.
LaunchDarkly or LocalStorage) within an application written using React with or
without Redux.

### `@flopflip/react-redux` & `@flopflip/react-broadcast` API

- `ConfigureFlopFlip` a component to configure flopflip with an adapter
  (alternative to the store enhancer)
- `ReconfigureFlopFlip` a component to reconfigure flopflip with new user properties
  either merged or overwriting old properties (`shouldOverwrite` prop)
  - `useAdapterReconfiguration` a hook to reconfigure flopflip with new user properties
    either merged or overwriting old properties (`shouldOverwrite` prop)
- `branchOnFeatureToggle` a Higher-Order Component (HoC) to conditionally render
  components depending on feature toggle state
- `injectFeatureToggle` a HoC to inject a feature toggle onto the `props` of a
  component
- `injectFeatureToggles` a HoC to inject requested feature toggles from existing
  feature toggles onto the `props` of a component
- `ToggleFeature` a component conditionally rendering its `children` based on
  the status of a passed feature flag
  `<ToggleFeature>` child based on the status of its passed feature flag
- `reducer` and `STATE_SLICE` a reducer and the state slice for the feature
  toggle state
- `createFlopFlipEnhancer` a redux store enhancer to configure flipflip and add
  feature toggle state to your redux store

### Configuration

You can setup flopflip to work in two ways:

1.  Use React's Context (hidden for you) via `@flopflip/react-broadcast`
2.  Integrate with Redux via `@flopflip/react-redux`

Often using `@flopflip/react-broadcast` will be the easiest way to get started. You would just need to pick an adapter which can be any of the provided. Either just a `memory-adapter` or an integration with LaunchDarkly via `launchdarkly-adapter` will work. More on how to use [`ConfigureFlopFlip`](#setup-using-components) below.

Whenever you want the flag state to live in Redux you can use `@flopflip/react-redux` which can be setup in two variations itself

1.  Again using [`ConfigureFlopFlip`](#setup-using-components) for simpler use cases, or...
2.  or with a Redux [`store enhancer`](#setup-through-a-redux-store-enhancer).

The store enhancer replaces `ConfigureFlopflip` for setup and gives the ability to pass in a `preloadedState` as default flags. For `ConfigureFlopflip` the default flags would be passed as a `defaultFlags`-prop.

#### Setup using Components

Setup is easiest using `ConfigureFlopFlip` which is available in both
`@flopflip/react-broadcast` and `@flopflip/react-redux`. Feel free to skip this
section whenever setup using a store enhancer (in a redux context) is preferred.

It takes the `props`:

- The `adapter` which can be e.g. `launchdarkly-adapter`
  - An `adapter` should implement the following methods: `configure` and
    `reconfigure` which both must return a `Promise` as configuration can be an
    asynchronous task
- The `adapterArgs` containing whatever the underlying `adapter` accepts
  - The `user` object is often the basis to identify an user to toggle features.
    The user object can contain any additional data.
  - The `adapter` will receive `onFlagsStateChange` and `onStatusStateChange`
    will should be invoked accordingly to notify `react-broadcast` and
    `react-redux` about flag and status changes
- The `shouldDeferAdapterConfiguration` prop can be used to defer the initial
  configuration the `adapter`. This might be helpful for cases in which you want
  to wait for e.g. the `key` to be present within your root component and you do
  not want `flopflip` to generate a `uuid` for you automatically.
- The `defaultFlags` prop object can be used to specify default flag values
  until an `adapter` responds or in case flags were removed
- The adapters expose function to update flags explicitely via `adapter.updateFlags`
  which eases updating flags and flushes them to all components via
  `react-broadcast` or `react-redux`

**Different adapters allow for different configurations:**

Please note that all adapters accept a `user: TUser` which has an optional `key` of type string. This `user` attribute can be used by each adapter to identify a user uniquely. Some adapters which require a `user.key` will generate a uuid whenever no `key` is passed.

1. The `@flopflip/launchdarkly-adapter` accepts

- `sdk.clientSideId`: The client side id of LaunchDarkly
- `sdk.clientOptions`: additional options to be passed to the underlying SDK
- `flags`: defaulting to `null` to subscribe only to specific flags. Helpful when not wanting to subscribe to all flags to utilise LaunchDarkly's automatic flag archiving functionality
- `subscribeToFlagChanges`: defaulting to `true` to disable real-time updates to flags once initially fetched
- `throwOnInitializationFailure`: defaulting to `false` to indicate if the adapter just re-throw an error during initialization
- `flagsUpdateDelayMs`: defaulting to `0` to debounce the flag update subscription

2. The `@flopflip/splitio-adapter` accepts

- `sdk.authorizationKey`: Authorization key for splitio
- `sdk.options`: General attributes passed to splitio SDK
- `sdk.treatmentAttributes`: The treatment attributes passed to splitio

3. The `@flopflip/graphql-adapter` accepts

- `uri`: the `uri` to the GraphQL endpoint so e.g. `https://graphql.com/graphql`
- `query`: the GraphQL query which returns features for instance `query AllFeatures { flags: allFeatures { name \n value} }`
- `getQueryVariables`: a function called with `adapterArgs` being variables to your GraphQL query
- `getRequestHeaders`: a function called with `adapterArgs` being headers to your GraphQL request
- `parseFlags`: a function called with the `data` of fetched flags to parse the result before being exposed to your application. This function should be used to parse a query response into the `TFlags` type.
- `fetcher`: a fetch implemtation if you prefer to not rely on the global `fetch`
- `pollingInteralMs`: the polling interval to check for updated flag values

4. The `@flopflip/localstorage-adapter` accepts

- `pollingInteralMs`: an interval at which the adapter polls for new flags from localstorage in milliseconds

5. The `@flopflip/memory-adapter` accepts

No special configuration is required for the memory adapter at this point.

Whenever you do not want to have the state of all flags persisted in redux the
minimal configuration for a setup with `@flopflip/react-broadcast` and
LaunchDarkly would be nothing more than:

```js
import { ConfigureFlopFlip } from '@flopflip/react-redux';
import adapter from '@flopflip/launchdarkly-adapter';
// or import adapter from '@flopflip/memory-adapter';
// or import adapter from '@flopflip/localstorage-adapter';

<ConfigureFlopFlip adapter={adapter} adapterArgs={{ clientSideId, user }}>
  <App />
</ConfigureFlopFlip>;
```

You can also pass `render` or `children` as a function to act differently based on the underlying adapter's ready state:

```jsx
<ConfigureFlopFlip adapter={adapter} adapterArgs={{ clientSideId, user }}>
  {(isAdapterConfigured) =>
    isAdapterConfigured ? <App /> : <LoadingSpinner />
  }
</ConfigureFlopFlip>
```

```jsx
<ConfigureFlopFlip
  adapter={adapter}
  adapterArgs={{ clientSideId, user }}
  render={() => <App />}
/>
```

Note that `children` will be called with a loading state prop while `render` will only be called when the adapter is configured. This behaviour mirrors the workings of `<ToggleFeature>`.

This variant of the `ConfigureFlopFlip` component form
`@flopflip/react-broadcast` will use the context and a broadcasting system to
reliably communicate with children toggling features (you do not have to worry
about any component returning `false` from `shouldComponentUpdate`). If you're using `@flopflip/react-broadcast` you're done already.

Given your preference is to have the feature flag's state persisted in redux you
would simply add a reducer when creating your store.

```js
import { createStore, compose, applyMiddleware } from 'redux';
import {
  ConfigureFlopFlip,
  flopflipReducer,
  FLOPFLIP_STATE_SLICE
} from '@flopflip/react-redux';

// Maintained somewhere within your application
import user from './user';
import appReducer from './reducer';

const store = createStore(
  combineReducers({
    appReducer,
    [FLOPFLIP_STATE_SLICE]: flopflipReducer,
  }),
  initialState,
  compose(
    applyMiddleware(...),
  )
)
```

#### Setup through a Redux store enhancer

Another way to configure `flopflip` is using a store enhancer. For this a
`flopflip` reducer should be wired up with a `combineReducers` within your
application in coordination with the `STATE_SLICE` which is used internally too
to manage the location of the feature toggle states. This setup eliminates the
need to use `ConfigureFlopFlip` somewhere else in your application's component
tree.

In context this configuration could look like

```js
import { createStore, compose, applyMiddleware } from 'redux';
import {
  createFlopFlipEnhancer,
  flopflipReducer,

  // We refer to this state slice in the `injectFeatureToggles`
  // HoC and currently do not support a custom state slice.
  FLOPFLIP_STATE_SLICE
} from '@flopflip/react-redux';
import adapter from '@flopflip/launchdarkly-adapter';

// Maintained somewhere within your application
import user from './user';
import appReducer from './reducer';

const store = createStore(
  combineReducers({
    appReducer,
    [FLOPFLIP_STATE_SLICE]: flopflipReducer,
  }),
  initialState,
  compose(
    applyMiddleware(...),
    createFlopFlipEnhancer(
      adapter,
      {
        clientSideId: window.application.env.LD_CLIENT_ID,
        user
      }
    )
  )
)
```

Note that `@flopflip/react-redux` also exports a `createFlopflipReducer(preloadedState: Flags)`. This is useful when you want to populate the redux store with initial values for your flags.

Example:

```js
const defaultFlags = { flagA: true, flagB: false };

combineReducers({
  appReducer,
  [FLOPFLIP_STATE_SLICE]: createFlopflipReducer(defaultFlags),
});
```

This way you can pass `defaultFlags` as the `preloadedState` directly into the `flopflipReducer`. This means you do not need to keep track of it in your applications's `initialState` as in the following anti-pattern example:

```js
const initialState = {
  [FLOPFLIP_STATE_SLICE]: { flagA: true, flagB: false },
};
const store = createStore(
  // ...as before
  initialState
  // ...as before
);
```

#### Syncing the store reducer with adapters

In addition to initiating `flopflip` when creating your store, you could still wrap most or all of your application's tree in
`ConfigureFlopFlip`. This is needed when you want to identify as a user and setup the integration with LaunchDarkly or any other flag provider or adapter.

Note: This is not needed when using the memory-adapter.

```js
import adapter from '@flopflip/launchdarkly-adapter';

<ConfigureFlopFlip adapter={adapter} adapterArgs={{ clientSideId, user }}>
  <App />
</ConfigureFlopFlip>;
```

Whenever your application "gains" certain information (e.g. with `react-router`) only further
down the tree but that information should be used for user targeting (through `adapterArgs.user`) you
can use `ReconfigureFlopflip`. `ReconfigureFlopflip` itself communicates with `ConfigureFlopflip`
to reconfigure the given adapter for more fine grained targeting with the passed `user`.
You also do not have to worry about rendering any number of `ReconfigureFlopflip`s before the adapter is
initialized (e.g. LaunchDarkly). Requested reconfigurations will be queued and processed once the adapter is configured.

Imagine having `ConfigureFlopflip` above a given component wrapped by a `Route`:

```jsx
<ConfigureFlopFlip adapter={adapter} adapterArgs={{ clientSideId, user }}>
  <>
    <SomeOtherAppComponent />
    <Route
      exact={false}
      path="/:projectKey"
      render={(routerProps) => (
        <>
          <MyRouteComponent />
          <ReconfigureFlopflip
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

Internally, `ReconfigureFlopFlip` will pass the `projectKey` to `ConfigureFlopFlip`, causing the adapter to automatically update the user context and therefore to flush new flags from the adapter (given they are provided by e.g. LaunchDarkly).

_Note:_ Whenever `shouldOverwrite` is `true` the existing user configuration will be overwritten not merged. Use with care as any
subsequent `shouldOverwrite={true}` will overwrite any previously passed `user` with `shouldOverwrite={false}` (default).

### `@flopflip/react-broadcast` & `@flopflip/react-redux` API

Apart from `ConfigureFlopFlip` both packages `@flopflip/react-broadcast` and
`@flopflip/react-redux` export the same set of components to toggle based on
features. Only the import changes depending on if you chose to integrate with
redux or without. Again, behind the scenes the build on `@flopflip/react` to
share common logic.

- `useFeatureToggle` a React hook to read a single flag
- `useFeatureToggles` a React hook to read multiple flags at once
- `useFlagVariation` a React hook to read a single variation of a flag
- `useFlagVariations` a React hook to read multiple variations of a flag at once
- `useAdapterStatus` a React hook to read the underlying adapter's status
- `branchOnFeatureToggle` a Higher-Order Component (HoC) to conditionally render
  components depending on feature toggle state
- `injectFeatureToggle` a HoC to inject a feature toggle onto the `props` of a
  component
- `injectFeatureToggles` a HoC to inject requested feature toggles from existing
  feature toggles onto the `props` of a component
- `ToggleFeature` a component conditionally rendering its `children` based on
  the status of a passed feature flag

[Note:](#flag-normalization) that all passed `flagNames` passed as `flag` are a string. Depending on the adapter used _these are normalized_ to be camel cased. This means that whenever a `foo-flag-name` is received in e.g. LaunchDarkly or splitio it will be converted to `fooFlagName`. The same applies for a `foo_flag_name`. This is meant to help using flags in an adapter agnostic way. Whenever a flag is passed in the non-normalized form it is also normalized again. Lastly, `flopflip` will show a warning message in the console in development mode whenever a non normalized flag name is passed.

#### `useFeatureToggle(flagName: string, flagVariation: FlagVariation): boolean`

Given you want to use React hooks within a functional component you can toggle as follows:

```js
import { useFeatureToggle } from '@flopflip/react-broadcast';

const ComponentWithFeatureToggle = props => {
   const isFeatureEnabled = useFeatureToggle('myFeatureToggle');

   return (
     <h3>{props.title}<h3>
     <p>
       The feature is {isFeatureEnabled ? 'enabled' : 'disabled'}
     </p>
   );
}
```

#### `useFeatureToggles({ [ flagName: string ]: FlagVariation } ): boolean[]`

Given you want to use React hooks within a functional component you can toggle multiple flags at once as follows:

```js
import { useFeatureToggles } from '@flopflip/react-broadcast';

const ComponentWithFeatureToggles = props => {
   const [isFirstFeatureEnabled, isV2SignUpEnabled] = useFeatureToggles({
     'myFeatureToggle': true,
     'mySignUpVariation': 'signUpV2',
   });

   return (
     <h3>{props.title}<h3>
     <p>
       The first feature is {isFirstFeatureEnabled ? 'enabled' : 'disabled'}
     </p>
     <p>
       The v2 signup feature is {isV2SignUpEnabled ? 'enabled' : 'disabled'}
     </p>
   );
}
```

#### `useFlagVariation(flagName: string): FlagVariation`

Given you want to use React hooks within a functional component you can read a variation as follows:

```js
import { useFlagVariation } from '@flopflip/react-broadcast';

const ComponentWithFeatureToggle = props => {
   const featureVariation = useFlagVariation('myFeatureToggle');

   return (
     <h3>{props.title}<h3>
     <p>
       The feature variation is {featureVariation}
     </p>
   );
}
```

#### `useFlagVaritions([flagName: string]): FlagVariation[]`

Given you want to use React hooks within a functional component you can read multiple variations as follows:

```js
import { useFlagVariations } from '@flopflip/react-broadcast';

const ComponentWithFeatureToggle = props => {
   const [featureVariation1, featureVariation2] = useFlagVariations(['myFeatureToggle1', 'myFeatureToggle2']);

   return (
     <h3>{props.title}<h3>
     <ul>
        <li>
          The feature variation 1 is {featureVariation1}
        </li>
        <li>
          The feature variation 2 is {featureVariation2}
        </li>
     </ul>
   );
}
```

#### `useAdapterStatus(): AdapterStatus`

Given you want to use React hooks within a functional component you can read the adapter status as follows:

```js
import { useAdapterStatus } from '@flopflip/react-broadcast';

const ComponentWithFeatureToggle = () => {
  const isFeatureEnabled = useFeatureToggle('myFeatureToggle');
  const { isConfigured } = useAdapterStatus();

  if (!isConfigured) return <LoadingSpinner />;
  else if (!isFeatureEnabled) <PageNotFound />;
  else return <FeatureComponent />;
};
```

#### `ToggleFeature`

The component renders its `children` depending on the state of a given feature
flag. It also allows passing an optional `untoggledComponent` which will be
rendered whenever the feature is disabled instead of `null`.

```js
import React, { Component } from 'react';
import { ToggleFeature } from '@flopflip/react-redux';
// or import { ToggleFeature } from '@flopflip/react-broadcast';
import flagsNames from './feature-flags';

const UntoggledComponent = () => <h3>{'At least there is a fallback!'}</h3>;
export default (
  <ToggleFeature
    flag={flagsNames.THE_FEATURE_TOGGLE}
    untoggledComponent={UntoggledComponent}
  >
    <h3>I might be gone or there!</h3>
  </ToggleFeature>
);
```

or with for multi variate feature toggles:

```js
const UntoggledComponent = () => <h3>{'At least there is a fallback!'}</h3>;

export default (
  <ToggleFeature
    flag={flagsNames.THE_FEATURE_TOGGLE.NAME}
    variation={flagsNames.THE_FEATURE_TOGGLE.VARIATES.A}
    untoggledComponent={UntoggledComponent}
  >
    <h3>I might be gone or there!</h3>
  </ToggleFeature>
);
```

or with `toggledComponent` prop:

```js
const UntoggledComponent = () => <h3>{'At least there is a fallback!'}</h3>;
const ToggledComponent = () => <h3>{'I might be gone or there!'}</h3>;

export default (
  <ToggleFeature
    flag={flagsNames.THE_FEATURE_TOGGLE.NAME}
    variation={flagsNames.THE_FEATURE_TOGGLE.VARIATES.A}
    untoggledComponent={UntoggledComponent}
    toggledComponent={ToggledComponent}
  />
);
```

or with Function as a Child (FaaC) which is always invoked with an `isFeatureEnabled` argument:

```js
const UntoggledComponent = () => <h3>{'At least there is a fallback!'}</h3>;

export default (
  <ToggleFeature
    flag={flagsNames.THE_FEATURE_TOGGLE.NAME}
    variation={flagsNames.THE_FEATURE_TOGGLE.VARIATES.A}
    untoggledComponent={UntoggledComponent}
  >
       {({ isFeatureEnabled }) => <h3>I might be gone or there!</h3>}
  </ToggleFeature>
);
```

or with a `render` prop. Note that the `render` prop will only be invoked then the feature is turned on:

```js
const UntoggledComponent = () => <h3>{'At least there is a fallback!'}</h3>;

export default (
  <ToggleFeature
    flag={flagsNames.THE_FEATURE_TOGGLE.NAME}
    variation={flagsNames.THE_FEATURE_TOGGLE.VARIATES.A}
    untoggledComponent={UntoggledComponent}
    render={() => <h3>I might be gone or there!</h3>}
  />
);
```

this last example will always turn the feature on if the variation or toggle
does not exist. For this also look at `defaultFlags` for `ConfigureFlopFlip`.

We actually recommend maintaining a list of constants with feature flag names
somewhere within your application. This avoids typos and unexpected behavior.
After all, the correct workings of your feature flags is crutial to your
application.

#### `branchOnFeatureToggle({ flag: String, variation?: String | Boolean })`

A HoC to conditionally render a component based on a feature toggle's state. It
accepts the feature toggle name and an optional component to be rendered in case
the feature is disabled.

Without a component rendered in place of the `ComponentToBeToggled`:

```js
import { branchOnFeatureToggle } from '@flopflip/react-redux';
import flagsNames from './feature-flags';

const ComponentToBeToggled = () => <h3>I might be gone or there!</h3>;

export default branchOnFeatureToggle({ flag: flagsNames.THE_FEATURE_TOGGLE })(
  ComponentToBeToggled
);
```

With a component rendered in place of the `ComponentToBeToggled`:

```js
import { branchOnFeatureToggle } from '@flopflip/react-redux';
import flagsNames from './feature-flags';

const ComponentToBeToggled = () => <h3>I might be gone or there!</h3>;
const ComponentToBeRenderedInstead = () => (
  <h3>At least there is a fallback!</h3>
);

export default branchOnFeatureToggle(
  { flag: flagsNames.THE_FEATURE_TOGGLE },
  ComponentToBeRenderedInstead
)(ComponentToBeToggled);
```

or when the flag is multi variation

```js
import { branchOnFeatureToggle } from '@flopflip/react-redux';
import flagsNames from './feature-flags';

const ComponentToBeToggled = () => <h3>I might be gone or there!</h3>;
const ComponentToBeRenderedInstead = () => (
  <h3>At least there is a fallback!</h3>
);

export default branchOnFeatureToggle(
  {
    flag: flagsNames.THE_FEATURE_TOGGLE,
    variation: 'variate1',
  },
  ComponentToBeRenderedInstead
)(ComponentToBeToggled);
```

#### `injectFeatureToggles(flagNames: Array<String>, propKey?: String, areOwnPropsEqual?: Function)`

This HoC matches feature toggles given against configured ones and injects the
matching result.

```js
import { injectFeatureToggles } from '@flopflip/react-redux';
import flagsNames from './feature-flags';

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

```js
import { injectFeatureToggle } from '@flopflip/react-redux';
import flagsNames from './feature-flags';

const Component = (props) => {
  if (props.isFeatureEnabled) return <h3>Something to render!</h3>;

  return <h3>Something different to render!</h3>;
};

export default injectFeatureToggle(flagsNames.TOGGLE_B)(Component);
```

The feature flags will be available as `props` within the component allowing
some custom decisions based on their value.

### Additional `@flopflip/react-redux` API

We also expose our internal selectors to access feature toggle(s) directly so
that the use of `injectFeatureToggle` or `injectFeatureToggles` is not enforced
or the only value to access flags from `@flopflip/react-redux`'s store slice.
The two selectors `selectFeatureFlag` and `selectFeatureFlags` return the same
values for flags as `injectFeatureToggle` and `injectFeatureToggles` would.

An example usage for a connected component would be:

```js
import { selectFeatureFlag } from '@flopflip/react-redux';

const mapStateToProps = (state) => ({
  someOtherState: state.someOtherState,
  isFeatureOn: selectFeatureFlag('fooFlagName')(state),
});

export default connect(mapStateToProps)(FooComponent);
```

as an alternative to using `injectFeatureToggle`:

```js
const mapStateToProps = state => ({
  someOtherState: state.someOtherState,
})

export default compose(
  injectFeatureToggle('fooFlagName')
  connect(mapStateToProps)
)(FooComponent)
```

The same example above applies for `selectFeatureFlags`.

#### `createFlopFlipEnhancer`

Requires arguments of `clientSideId:string`, `user:object`.

- The `adapter`
- The `adapterArgs` object
  - Often with the before mentioned user object `user` object which often needs
    at least a `key` attribute

### `@flopflip/cypress-plugin`

#### Introduction

Changing flag state in End-to-End test runs helps ensuring that an application works as expected with all variations of a feature. For this `@flopflip` comes with a `cypress-plugin`. This plugin tightly integrates with any underlying adapter and allows altering flag state from within test runs.

Imagine having the following Cypress test suite:

```js
describe('adding users', () => {
  describe('with seaching by E-Mail being enabled', () => {
    it('should allow adding users by E-Mail', () => {
      cy.updateFeatureFlags({ searchUsersByEmail: true });

      //... expectations
    });
  });
  describe('with seaching by E-Mail being disabled', () => {
    it('should allow adding users by name', () => {
      cy.updateFeatureFlags({ searchUsersByEmail: false });

      //... expectations
    });
  });
});
```

In the example above we test two variations of a feature. Being able to alter flag state during test runs avoids work-arounds such as complex multi-project setups and makes the tests themselves resilient to changes of your flag configurations on your staging or testing environments.

#### Installation

To install the `@flopflip/cypress-plugin` you will have to add the respective command and plugin as follows after installing it as a `devDependency`.

```bash
yarn add --dev @floplfip/cypress-plugin
npm install --save-dev @floplfip/cypress-plugin
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

```js
import { addCommands as addFlopflipCommands } from '@flopflip/cypress-plugin';

addFlopflipCommands({
  adapterId: 'launchdarkly',
});
```

Please note that the `adapterId` should be one of `launchdarkly`, `memory`, `localstorage` or `splitio`. It allows the `cypress-plugin` to hook into the respective adapter. Also make sure to update to the most recent version of any adapter to ensure a smooth integration between the plugin and the adapter.

### Module formats

`@flopflip/react-redux` and `@flopflip/react-broadcast` is built for UMD (un-
and minified) and ESM using
[`rollup`](https://github.com/tdeekens/flopflip/blob/master/rollup.config.js).

Both our `@flopflip/launchdarkly-wrapper` and `@flopflip/react` packages are
"only" build for ESM and CommonJS (not UMD) as they are meant to be consumed by
a module loader to be integrated.

The `package.json` files contain a `main` and `module` entry to point to a
CommonJS and ESM build.

- ...ESM just import the `dist/@flopflip/<package>.es.js` within your app.
  - ...it's a transpiled version accessible via the `pkg.module`
- ...CommonJS use the `dist/@flopflip/<package>.cjsjs`
- ...AMD use the `dist/@flopflip/<package>.umd.js`
- ...`<script />` link it to `dist/@flopflip/<package>.umd.js` or
  `dist/@flopflip/<package>.umd.min.js`

All build files are part of the npm distribution using the
[`files`](https://github.com/tdeekens/flopflip/blob/master/packages/react-redux/package.json)
array to keep install time short.

Also feel free to use
[unpkg.com](https://unpkg.com/@flopflip/react-redux@latest/dist/@flopflip-react-redux.umd.min.js)
as a CDN to the [dist](https://unpkg.com/@flopflip/react-redux@latest/dist/)
files.
