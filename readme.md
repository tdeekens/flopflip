<p align="center">
  <img alt="Logo" src="https://raw.githubusercontent.com/tdeekens/flopflip/master/logo.png" /><br /><br />
</p>

<h2 align="center">🎚 flopflip - Feature Toggling 🚦</h2>
<p align="center">
  <i>Toggle features (flip or flop) in being maintained in a Redux state slice or a broadcasting system (through the context) being accessible through a set of Higher-Order Components in React.</i>
</p>

<p align="center">
  <em>
  ❤️
  React
  · Redux
  · Recompose
  · Jest
  · Prettier
  · Flow
  · Enzyme
  · ESLint
  · Babel
  · Lodash
  · Lerna
  · Rollup
  🙏
  </em>
</p>

<p align="center">
  <a href="https://circleci.com/gh/tdeekens/flopflip">
    <img alt="CircleCI Status" src="https://circleci.com/gh/tdeekens/flopflip.svg?style=shield&circle-token=63ee7a0e1c766b6b76da6f7ba4c7b9f2a7876191">
  </a>
  <a href="https://codecov.io/gh/tdeekens/flopflip">
    <img alt="Codecov Coverage Status" src="https://img.shields.io/codecov/c/github/tdeekens/flopflip.svg?style=flat-square">
  </a><br /><br />
  <a href="https://techblog.commercetools.com/embracing-real-time-feature-toggling-in-your-react-application-a5e6052716a9">
    Embracing real-time feature toggling in your React application
  </a><br /><br />
  <a href="https://www.youtube.com/watch?v=x-IqMNFPmkk">
    Feature flagging with LaunchDarkly - Fun Fun Function
  </a>
</p>

<details><br /><br />
  <summary>Want to see a demo?</summary>

  <img alt="Logo" src="https://raw.githubusercontent.com/tdeekens/flopflip/master/demo.gif" />
  <br /><br />
</details>

## Browser support

| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Opera | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari-ios.png" alt="iOS Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome-android.png" alt="Chrome for Android" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome for Android |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11, Edge                                                                                                                                                                                                             | last 2 versions                                                                                                                                                                                                       | last 2 versions                                                                                                                                                                                                    | last 2 versions                                                                                                                                                                                                    | last 2 versions                                                                                                                                                                                                 | last 2 versions                                                                                                                                                                                                                | last version                                                                                                                                                                                                                                       |

## Package Status

| Package                                                  | Version                                                                                    | Dependencies                                                                                                             |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| [`launchdarkly-adapter`](/packages/launchdarkly-adapter) | [![launchdarkly-adapter Version][launchdarkly-adapter-icon]][launchdarkly-adapter-version] | [![launchdarkly-adapter Dependencies Status][launchdarkly-adapter-dependencies-icon]][launchdarkly-adapter-dependencies] |
| [`splitio-adapter`](/packages/splitio-adapter)           | [![splitio-adapter Version][splitio-adapter-icon]][splitio-adapter-version]                | [![splitio-adapter Dependencies Status][splitio-adapter-dependencies-icon]][splitio-adapter-dependencies]                |
| [`memory-adapter`](/packages/memory-adapter)             | [![memory-adapter Version][memory-adapter-icon]][memory-adapter-version]                   | [![memory-adapter Dependencies Status][memory-adapter-dependencies-icon]][memory-adapter-dependencies]                   |
| [`localstorage-adapter`](/packages/localstorage-adapter) | [![localstorage-adapter Version][localstorage-adapter-icon]][localstorage-adapter-version] | [![localstorage-adapter Dependencies Status][localstorage-adapter-dependencies-icon]][localstorage-adapter-dependencies] |
| [`react`](/packages/react)                               | [![react Version][react-icon]][react-version]                                              | [![react Dependencies Status][react-dependencies-icon]][react-dependencies]                                              |
| [`react-broadcast`](/packages/react-broadcast)           | [![react-broadcast Version][react-broadcast-icon]][react-broadcast-version]                | [![react-broadcast Dependencies Status][react-broadcast-dependencies-icon]][react-broadcast-dependencies]                |
| [`react-redux`](/packages/react-redux)                   | [![react-redux Version][react-redux-icon]][react-redux-version]                            | [![react-redux Dependencies Status][react-redux-dependencies-icon]][react-redux-dependencies]                            |
| [`types`](/packages/types)                               | [![types Version][types-icon]][types-version]                                              | [![types Dependencies Status][types-dependencies-icon]][types-dependencies]                                              |

[types-version]: https://www.npmjs.com/package/@flopflip/types
[types-icon]: https://img.shields.io/npm/v/@flopflip/types.svg?style=flat-square
[types-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/types
[types-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&
[splitio-adapter-version]: https://www.npmjs.com/package/@flopflip/splitio-adapter
[splitio-adapter-icon]: https://img.shields.io/npm/v/@flopflip/splitio-adapter.svg?style=flat-square
[splitio-adapter-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/splitio-adapter
[splitio-adapter-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/splitio-adapter
[launchdarkly-adapter-version]: https://www.npmjs.com/package/@flopflip/launchdarkly-adapter
[launchdarkly-adapter-icon]: https://img.shields.io/npm/v/@flopflip/launchdarkly-adapter.svg?style=flat-square
[launchdarkly-adapter-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/launchdarkly-adapter
[launchdarkly-adapter-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/launchdarkly-adapter
[memory-adapter-version]: https://www.npmjs.com/package/@flopflip/memory-adapter
[memory-adapter-icon]: https://img.shields.io/npm/v/@flopflip/memory-adapter.svg?style=flat-square
[memory-adapter-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/memory-adapter
[memory-adapter-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/memory-adapter
[localstorage-adapter-version]: https://www.npmjs.com/package/@flopflip/localstorage-adapter
[localstorage-adapter-icon]: https://img.shields.io/npm/v/@flopflip/localstorage-adapter.svg?style=flat-square
[localstorage-adapter-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/localstorage-adapter
[localstorage-adapter-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/localstorage-adapter
[react-version]: https://www.npmjs.com/package/@flopflip/react
[react-icon]: https://img.shields.io/npm/v/@flopflip/react.svg?style=flat-square
[react-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/react
[react-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/react
[react-broadcast-version]: https://www.npmjs.com/package/@flopflip/react-broadcast
[react-broadcast-icon]: https://img.shields.io/npm/v/@flopflip/react-broadcast.svg?style=flat-square
[react-broadcast-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/react-broadcast
[react-broadcast-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/react-broadcast
[react-redux-version]: https://www.npmjs.com/package/@flopflip/react-redux
[react-redux-icon]: https://img.shields.io/npm/v/@flopflip/react-redux.svg?style=flat-square
[react-redux-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/react-redux
[react-redux-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/react-redux

## Installation

This is a mono repository maintained using
[lerna](https://github.com/lerna/lerna). It currently contains five
[packages](/packages) in a `memory-adapter`, a `localstorage-adapter` or
`launchdarkly-adapter`, `react`, `react-redux` and `react-broadcast`. You should
not need the `launchdarkly-adapter` yourself but one of our bindings
(react-broadcast or react-redux). Both use the `react` package to share
components.

Depending on the preferred integration (with or without redux) use:

`yarn add @flopflip/react-redux` or `npm i @flopflip/react-redux --save`

or

`yarn add @flopflip/react-broadcast` or `npm i @flopflip/react-broadcast --save`

## Demo

A minimal [demo](/demo) exists and can be adjusted to point to a
[custom](https://github.com/tdeekens/flopflip/blob/master/demo/src/App.js#L108)
LaunchDarkly account. You would have to create feature toggles according to the
existing
[flags](https://github.com/tdeekens/flopflip/blob/master/demo/src/flags.js),
though.

Then simply run:

1. From the repositories root: `yarn build:watch`
2. From `/demo`: first `yarn` and then `yarn start`

A browser window should open and the network tab should show feature flags being
loaded from LaunchDarkly.

## Documentation

Flopflip allows you to manage feature flags through the notion of adapters (e.g.
LaunchDarkly or LocalStorage) within an application written using React with or
without Redux.

### `@flopflip/react-redux` & `@flopflip/react-broadcast` API & exports

* `ConfigureFlopFlip` a component to configure flopflip with an adapter
  (alternative to the store enhancer)
* `branchOnFeatureToggle` a Higher-Order Component (HoC) to conditionally render
  components depending on feature toggle state
* `injectFeatureToggle` a HoC to inject a feature toggle onto the `props` of a
  component
* `injectFeatureToggles` a HoC to inject requested feature toggles from existing
  feature toggles onto the `props` of a component
* `ToggleFeature` a component conditionally rendering its `children` based on
  the status of a passed feature flag
* `SwitchFeature` a component conditionally rendering the first
  `<ToggleFeature>` child based on the status of its passed feature flag
* `reducer` and `STATE_SLICE` a reducer and the state slice for the feature
  toggle state
* `createFlopFlipEnhancer` a redux store enhancer to configure flipflip and add
  feature toggle state to your redux store

#### Configuration

Setup is easiest using `ConfigureFlopFlip` which is available in both
`@flopflip/react-broadcast` and `@flopflip/react-redux`. Feel free to skip this
section whenever setup using a store enhancer (in a redux context) is preferred.

It takes the `props`:

* The `adapter` which can be e.g. `launchdarkly-adapter`
  * An `adapter` should implement the following methods: `configure` and
    `reconfigure` which both must return a `Promise` as configuration can be an
    asynchronous task
* The `adapterArgs` containing whatever the underlying `adapter` accepts
  * The `user` object is often the basis to identify an user to toggle features.
    The user object can contain any additional data.
  * The `adapter` will receive `onFlagsStateChange` and `onStatusStateChange`
    will should be invoked accordingly to notify `react-broadcast` and
    `react-redux` about flag and status changes
* The `shouldDeferAdapterConfiguration` prop can be used to defer the initial
  configuration the `adapter`. This might be helpful for cases in which you want
  to wait for e.g. the `key` to be present within your root component and you do
  not want `flopflip` to generate a `uuid` for you automatically.
* The `defaultFlags` prop object can be used to specify default flag values
  until an `adapter` responds or in case flags were removed
* The `localstorage-adapter` and `memory-adapter` expose a named `updateFlags`
  export which eases updating flags and flushes them to all components via
  `react-broadcast` or `react-redux`

Whenever you do not want to have the state of all flags persisted in redux the
minimal configuration for a setup with `@flopflip/react-broadcast` and
LaunchDarkly would be nothing more than

```js
import { ConfigureFlopFlip } from '@flopflip/react-redux';
import adapter from '@flopflip/launchdarkly-adapter';
// or import adapter from '@flopflip/memory-adapter';
// or import adapter from '@flopflip/localstorage-adapter';

<ConfigureFlopFlip adapter={adapter} adapterArgs={{ clientSideId, user }}>
  <App />
</ConfigureFlopFlip>;
```

This variant of the `ConfigureFlopFlip` component form
`@flopflip/react-broadcast` will use the context and a broadcasting system to
reliably communicate with children toggling features (you do not have to worry
about any component returning `false` from `shouldComponentUpdate`).

Given your preference is to have the feature flag's state persisted in redux you
would simply add a reducer when creating your store

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

Whereas you would still wrap most or all of your application's tree in
`ConfigureFlopFlip` to identify a user and setup the integration with
LaunchDarkly

```js
import adapter from '@flopflip/launchdarkly-adapter';

<ConfigureFlopFlip adapter={adapter} adapterArgs={(clientSideId, user)}>
  <App />
</ConfigureFlopFlip>;
```

### `@flopflip/react-broadcast` `@flopflip/react-redux` API & exports for toggling

Apart from `ConfigureFlopFlip` both packages `@flopflip/react-broadcast` and
`@flopflip/react-redux` export the same set of components to toggle based on
features. Only the import changes depending on if you chose to integrate with
redux or without. Again, behind the scenes the build on `@flopflip/react` to
share common logic.

* `branchOnFeatureToggle` a Higher-Order Component (HoC) to conditionally render
  components depending on feature toggle state
* `injectFeatureToggle` a HoC to inject a feature toggle onto the `props` of a
  component
* `injectFeatureToggles` a HoC to inject requested feature toggles from existing
  feature toggles onto the `props` of a component
* `ToggleFeature` a component conditionally rendering its `children` based on
  the status of a passed feature flag
* `SwitchFeature` a component that renders its first <ToggleFeature> child based
  on the status of a passed feature flag

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

#### `SwitchFeature`

The component renders its first `ToggleFeature` child depending on the state of
a given feature flag. This component is helps working with toggling of multi
variate flags but does not restrict its `children` to that.

_This example outlines the usage of different ways of working with
`ToggleFeature`._

```jsx
<SwitchFeature>
  <ToggleFeature
    flag={flagsNames.THE_FEATURE_TOGGLE.NAME}
    variation={flagsNames.THE_FEATURE_TOGGLE.VARIATES.A}
    toggledComponent={MyFeatureComponent}
  />
  <ToggleFeature
    flag={flagsNames.THE_FEATURE_TOGGLE.NAME}
    variation={flagsNames.THE_FEATURE_TOGGLE.VARIATES.B}
    render={() => <p>Feature is turned on</p>}
  />
  <ToggleFeature
    flag={flagsNames.THE_FEATURE_TOGGLE.NAME}
    variation={flagsNames.THE_FEATURE_TOGGLE.VARIATES.C}
  >
    {({ isFeautureEnabled }) => (
      <p>Is the feature turned on?: {isFeatureEnabled}</p>
    )}
  </ToggleFeature>
  <ToggleFeature
    flag={flagsNames.THE_FEATURE_TOGGLE.NAME}
    variation={flagsNames.THE_FEATURE_TOGGLE.VARIATES.D}
    toggledComponent={MyFeatureComponent}
    untoggledComponent={MyDisabledFeatureComponent}
  />
</SwitchFeature>
```

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

export default branchOnFeatureToggle({ flag: flagsNames.THE_FEATURE_TOGGLE }, ComponentToBeRenderedInstead)(
  ComponentToBeToggled
);
```

or when the flag is multi variation

```js
import { branchOnFeatureToggle } from '@flopflip/react-redux';
import flagsNames from './feature-flags';

const ComponentToBeToggled = () => <h3>I might be gone or there!</h3>;
const ComponentToBeRenderedInstead = () => (
  <h3>At least there is a fallback!</h3>
);

export default branchOnFeatureToggle({
  flag: flagsNames.THE_FEATURE_TOGGLE,
  variation: 'variate1',
}, ComponentToBeRenderedInstead)(ComponentToBeToggled);
```

#### `injectFeatureToggles(flagNames: Array<String>, propKey?: String, areOwnPropsEqual?: Function)`

This HoC matches feature toggles given against configured ones and injects the
matching result.

```js
import { injectFeatureToggles } from '@flopflip/react-redux';
import flagsNames from './feature-flags';

const Component = props => {
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

const Component = props => {
  if (props.isFeatureEnabled) return <h3>Something to render!</h3>;

  return <h3>Something different to render!</h3>;
};

export default injectFeatureToggle(flagsNames.TOGGLE_B)(Component);
```

The feature flags will be available as `props` within the component allowing
some custom decisions based on their value.

### `@flopflip/react-redux` additional API & exports

We also expose our internal selectors to access feature toggle(s) directly so
that the use of `injectFeatureToggle` or `injectFeatureToggles` is not enforced
or the only value to access flags from `@flopflip/react-redux`'s store slice.
The two selectors `selectFeatureFlag` and `selectFeatureFlags` return the same
values for flags as `injectFeatureToggle` and `injectFeatureToggles` would.

An example usage for a connected component would be:

```js
import { selectFeatureFlag } from '@flopflip/react-redux';

const mapStateToProps = state => ({
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

* The `adapter`
* The `adapterArgs` object
  * Often with the before mentioned user object `user` object which often needs
    at least a `key` attribute

#### `reducer` & `STATE_SLICE`

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

### Module formats

`@flopflip/react-redux` and `@flopflip/react-broadcast` is built for UMD (un-
and minified) and ESM using
[`rollup`](https://github.com/tdeekens/flopflip/blob/master/rollup.config.js).

Both our `@flopflip/launchdarkly-wrapper` and `@flopflip/react` packages are
"only" build for ESM and CommonJS (not UMD) as they are meant to be consumed by
a module loader to be integrated.

The `package.json` files contain a `main` and `module` entry to point to a
CommonJS and ESM build.

* ...ESM just import the `dist/@flopflip/<package>.es.js` within your app.
  * ...it's a transpiled version accessible via the `pkg.module`
* ...CommonJS use the `dist/@flopflip/<package>.cjsjs`
* ...AMD use the `dist/@flopflip/<package>.umd.js`
* ...`<script />` link it to `dist/@flopflip/<package>.umd.js` or
  `dist/@flopflip/<package>.umd.min.js`

All build files are part of the npm distribution using the
[`files`](https://github.com/tdeekens/flopflip/blob/master/packages/react-redux/package.json)
array to keep install time short.

Also feel free to use
[unpkg.com](https://unpkg.com/@flopflip/react-redux@latest/dist/@flopflip-react-redux.umd.min.js)
as a CDN to the [dist](https://unpkg.com/@flopflip/react-redux@3.0.1/dist/)
files.
