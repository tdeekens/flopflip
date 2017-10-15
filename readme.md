<p align="center">
  <b style="font-size: 25px">🎛 flopflip - Feature Toggling 🎚</b><br />
  <i>flip or flop a feature in LaunchDarkly with real-time updates through a Redux store by directly using React's context.</i>
</p>

<p align="center">
  <img alt="Logo" src="https://raw.githubusercontent.com/tdeekens/flopflip/master/logo.png" /><br /><br />
  <i>Toggle features in LaunchDarkly with their state being maintained in a Redux state slice or a broadcasting system (through the context) being accessible through a set of Higher-Order Components in React.</i>
  <br /><br />
  <a href="https://travis-ci.org/tdeekens/flopflip">
    <img alt="Travis CI Status" src="https://img.shields.io/travis/tdeekens/flopflip/master.svg?style=flat-square&label=travis">
  </a>
  <a href="https://codecov.io/gh/tdeekens/flopflip">
    <img alt="Codecov Coverage Status" src="https://img.shields.io/codecov/c/github/tdeekens/flopflip.svg?style=flat-square">
  </a><br /><br />
  <a href="https://techblog.commercetools.com/embracing-real-time-feature-toggling-in-your-react-application-a5e6052716a9">
    Embracing real-time feature toggling in your React application
  </a>
</p>

<details><br /><br />
  <summary>Want to see a demo?</summary>

  <img alt="Logo" src="https://raw.githubusercontent.com/tdeekens/flopflip/master/demo.gif" />
  <br /><br />
</details>

## Browser support

| [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>IE / Edge | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Firefox | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/opera.png" alt="Opera" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Opera | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari-ios.png" alt="iOS Safari" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>iOS Safari | [<img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome-android.png" alt="Chrome for Android" width="16px" height="16px" />](http://godban.github.io/browsers-support-badges/)</br>Chrome for Android |
| --------- | --------- | --------- | --------- | --------- | --------- | --------- |
| IE11, Edge| last 2 versions| last 2 versions| last 2 versions| last 2 versions| last 2 versions| last version

## Package Status

| Package | Version | Dependencies |
|--------|-------|------------|
| [`launchdarkly-wrapper`](/packages/launchdarkly-wrapper) | [![launchdarkly-wrapper Version][launchdarkly-wrapper-icon]][launchdarkly-wrapper-version] | [![launchdarkly-wrapper Dependencies Status][launchdarkly-wrapper-dependencies-icon]][launchdarkly-wrapper-dependencies] |
| [`react`](/packages/react) | [![react Version][react-icon]][react-version] | [![react Dependencies Status][react-dependencies-icon]][react-dependencies] |
| [`react-broadcast`](/packages/react-broadcast) | [![react-broadcast Version][react-broadcast-icon]][react-broadcast-version] | [![react-broadcast Dependencies Status][react-broadcast-dependencies-icon]][react-broadcast-dependencies] |
| [`react-redux`](/packages/react-redux) | [![react-redux Version][react-redux-icon]][react-redux-version] | [![react-redux Dependencies Status][react-redux-dependencies-icon]][react-redux-dependencies] |

[launchdarkly-wrapper-version]: https://www.npmjs.com/package/@flopflip/launchdarkly-wrapper
[launchdarkly-wrapper-icon]: https://img.shields.io/npm/v/@flopflip/launchdarkly-wrapper.svg?style=flat-square
[launchdarkly-wrapper-dependencies]: https://david-dm.org/tdeekens/flopflip?path=packages/launchdarkly-wrapper
[launchdarkly-wrapper-dependencies-icon]: https://david-dm.org/tdeekens/flopflip/status.svg?style=flat-square&path=packages/launchdarkly-wrapper
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

This is a mono repository maintained using [lerna](https://github.com/lerna/lerna). It currently contains four [packages](/packages) in a `launchdarkly-wrapper`, `react`, `react-redux` and `react-broadcast`. You should not need the `launchdarkly-wrapper` yourself but one of our bindings (react-broadcast or react-redux). Both use the `react` package to share components.

Depending on the preferred integration (with or without redux) use:

`yarn add @flopflip/react-redux` or `npm i @flopflip/react-redux --save`

or

`yarn add @flopflip/react-broadcast` or `npm i @flopflip/react-broadcast --save`

## Demo

A minimal [demo](/demo) exists and can be adjusted to point to a [custom](https://github.com/tdeekens/flopflip/blob/master/demo/src/App.js#L108) LaunchDarkly account. You would have to create feature toggles according to the existing [flags](https://github.com/tdeekens/flopflip/blob/master/demo/src/flags.js), though.

Then simply run:

1. From the repositories root: `yarn build:watch`
2. From `/demo`: first `yarn` and then `yarn start`

A browser window should open and the network tab should show feature flags being loaded from LaunchDarkly.

## Documentation

Flopflip allows you to manage feature flags through [LaunchDarkly](https://launchdarkly.com/) within an application written using React with or without Redux.

### `@flopflip/react-redux` & `@flopflip/react-broadcast` API & exports

- `ConfigureFlopFlip` a component to configure LaunchDarkly (alternative to the store enhancer)
- `withFeatureToggle` a Higher-Order Component (HoC) to conditionally render components depending on feature toggle state
- `injectFeatureToggle` a HoC to inject a feature toggle onto the `props` of a component
- `injectFeatureToggles` a HoC to inject requested feature toggles from existing feature toggles onto the `props` of a component
- `FeatureToggled` a component conditionally rendering its `children` based on the status of a passed feature flag
- `reducer` and `STATE_SLICE` a reducer and the state slice for the feature toggle state
- `createFlopFlipEnhancer` a redux store enhancer to configure LaunchDarkly and add feature toggle state to your redux store

#### Configuration

Setup is easiest using `ConfigureFlopFlip` which is available in both `@flopflip/react-broadcast` and `@flopflip/react-redux`. Feel free to skip this section whenever setup using a store enhancer (in a redux context) is preferred.

It takes the `props`:

- The `clientSideId` is your LaunchDarkly ID.
- The `user` object needs at least a `key` attribute. An anonymous `key` will be generated using a `uuid` when nothing is specified. The user object can contain additional data.
- The `shouldInitialize` prop can be used to defer the flag subscription setup towards LaunchDarkly (via their SDK). This might be helpful for cases in which you want to wait for e.g. the `key` to be present within your root component and you do not want `flopflip` to generate a `uuid` for you automatically.
- The `shouldChangeUserContext` boolean prop to indicate whether `flopflip` should watch the `key` property on the `user` to change the user context on LaunchDarkly's SDK (defaults to `false`)
- The `defaultFlags` prop object can be used to specify default flag values until LaunchDarkly responds or in case flags were removed from their platform (flag keys will be camel cased as with response from LaunchDarkly's API so e.g. `{ 'a-flag': true }` becomes `{ aFlag: true }`)

Whenever you do not want to have the state of all flags persisted in redux the minimal configuration for a setup with `@flopflip/react-broadcast` would be nothing more than

```js
import { ConfigureFlopFlip } from '@flopflip/react-redux';

<ConfigureFlopFlip user={user} clientSideId={clientSideId}>
  <App />
</ConfigureFlopFlip>;
```

This variant of the `ConfigureFlopFlip` component form `@flopflip/react-broadcast` will use the context and a broadcasting system to reliably communicate with children toggling features (you do not have to worry about any component returning `false` from `shouldComponentUpdate`).

Given your preference is to have the feature flag's state persisted in redux you would simply add a reducer when creating your store

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

Whereas you would still wrap most or all of your application's tree in `ConfigureFlopFlip` to identify a user and setup the integration with LaunchDarkly

```js
<ConfigureFlopFlip user={user} clientSideId={clientSideId}>
  <App />
</ConfigureFlopFlip>
```

### `@flopflip/react-broadcast` `@flopflip/react-redux` API & exports for toggling

Apart from `ConfigureFlopFlip` both packages `@flopflip/react-broadcast` and `@flopflip/react-redux` export the same set of components to toggle based on features. Only the import changes depending on if you chose to integrate with redux or without. Again, behind the scenes the build on `@flopflip/react` to share common logic.

- `withFeatureToggle` a Higher-Order Component (HoC) to conditionally render components depending on feature toggle state
- `injectFeatureToggle` a HoC to inject a feature toggle onto the `props` of a component
- `injectFeatureToggles` a HoC to inject requested feature toggles from existing feature toggles onto the `props` of a component
- `FeatureToggled` a component conditionally rendering its `children` based on the status of a passed feature flag

#### `FeatureToggled`

The component renders its `children` depending on the state of a given feature flag. It also allows passing an optional `untoggledComponent` which will be rendered whenever the feature is disabled instead of `null`.

```js
import React, { Component } from 'react';
import { FeatureToggled } from '@flopflip/react-redux';
// or import { FeatureToggled } from '@flopflip/react-broadcast';
import flagsNames from './feature-flags';

export default (
  <FeatureToggled
    flag={flagsNames.THE_FEATURE_TOGGLE}
    untoggledComponent={<h3>At least there is a fallback!</h3>}
  >
    <h3>I might be gone or there!</h3>
  </FeatureToggled>
);
```

or with for multivariate feature toggles

```js
export default (
  <FeatureToggled
    flag={flagsNames.THE_FEATURE_TOGGLE.NAME}
    variate={flagsNames.THE_FEATURE_TOGGLE.VARIATES.A}
    untoggledComponent={<h3>At least there is a fallback!</h3>}
  >
    <h3>I might be gone or there!</h3>
  </FeatureToggled>
);
```

this last example will always turn the feature on if the variate or toggle does not exist. For this also look at `defaultFlags` for `ConfigureFlopFlip`.

We actually recommend maintaining a list of constants with feature flag names somewhere within your application. This avoids typos and unexpected behavior. After all, the correct workings of your feature flags is crutial to your application.

#### `withFeatureToggle({ flag: String, variate?: String | Boolean })`

A HoC to conditionally render a component based on a feature toggle's state. It accepts the feature toggle name and an optional component to be rendered in case the feature is disabled.

Without a component rendered in place of the `ComponentToBeToggled`:

```js
import { withFeatureToggle } from '@flopflip/react-redux';
import flagsNames from './feature-flags';

const ComponentToBeToggled = () => <h3>I might be gone or there!</h3>;

export default withFeatureToggle({ flag: flagsNames.THE_FEATURE_TOGGLE })(
  ComponentToBeToggled
);
```

With a component rendered in place of the `ComponentToBeToggled`:

```js
import { withFeatureToggle } from '@flopflip/react-redux';
import flagsNames from './feature-flags';

const ComponentToBeToggled = () => <h3>I might be gone or there!</h3>;
const ComponentToBeRenderedInstead = () => (
  <h3>At least there is a fallback!</h3>
);

export default withFeatureToggle({ flag: flagsNames.THE_FEATURE_TOGGLE })(
  ComponentToBeToggled,
  ComponentToBeRenderedInstead
);
```

or when the flag is multi variate

```js
import { withFeatureToggle } from '@flopflip/react-redux';
import flagsNames from './feature-flags';

const ComponentToBeToggled = () => <h3>I might be gone or there!</h3>;
const ComponentToBeRenderedInstead = () => (
  <h3>At least there is a fallback!</h3>
);

export default withFeatureToggle({
  flag: flagsNames.THE_FEATURE_TOGGLE,
  variate: 'variate1'
})(ComponentToBeToggled, ComponentToBeRenderedInstead);
```

#### `injectFeatureToggles(flagNames: Array<String>, propKey?: String)`

This HoC matches feature toggles given against configured ones and injects the matching result.
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

This HoC matches feature toggles given against configured ones and injects the matching result. `withFeatureToggle` uses this to conditionally render a component. You also may pass a second argument to overwrite the default `propKey` of the injected toggle (defaults to `isFeatureEnabled`).

```js
import { injectFeatureToggle } from '@flopflip/react-redux';
import flagsNames from './feature-flags';

const Component = props => {
  if (props.isFeatureEnabled) return <h3>Something to render!</h3>;

  return <h3>Something different to render!</h3>;
};

export default injectFeatureToggle(flagsNames.TOGGLE_B)(Component);
```

The feature flags will be available as `props` within the component allowing some custom decisions based on their value.

#### `createFlopFlipEnhancer`

Requires arguments of `clientSideId:string`, `user:object`.

- The `clientSideId` is your LaunchDarkly ID.
- The `user` object needs at least a `key` attribute. An anonymous `key` will be generated using `uuid4` when nothing is specified. The user object can contain additional data.

#### `reducer` & `STATE_SLICE`

Another way to configure `flopflip` is using a store enhancer. For this a `flopflip` reducer should be wired up with a `combineReducers` within your application in coordination with the `STATE_SLICE` which is used internally too to manage the location of the feature toggle states. This setup eliminates the need to use `ConfigureFlopFlip` somewhere else in your application's component tree.

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
      // NOTE:
      //   This clientId is not secret to you  and can be found
      //   within your settings on LaunchDarkly.
      window.application.env.LD_CLIENT_ID,
      user
    )
  )
)
```

### Module formats

`@flopflip/react-redux` and `@flopflip/react-broadcast` is built for UMD (un- and minified) and ESM using [`rollup`](https://github.com/tdeekens/flopflip/packages/react-redux/blob/master/rollup.config.js).

Both our `@flopflip/launchdarkly-wrapper` and `@flopflip/react` packages are "only" build for ESM and CommonJS (not UMD) as they are meant to be consumed by a module loader to be integrated.

The `package.json` files contain a `main` and `module` entry to point to a CommonJS and ESM build.

- ...ESM just import the `dist/@flopflip/<package>.es.js` within your app.
  - ...it's a transpiled version accessible via the `pkg.module`
- ...CommonJS use the `dist/@flopflip/<package>.cjsjs`
- ...AMD use the `dist/@flopflip/<package>.umd.js`
- ...`<script />` link it to `dist/@flopflip/<package>.umd.js` or `dist/@flopflip/<package>.umd.min.js`

All build files are part of the npm distribution using the [`files`](https://github.com/tdeekens/@flopflip/packages/react-redux/blob/master/package.json) array to keep install time short.

Also feel free to use [unpkg.com](https://unpkg.com/@flopflip/react-redux@latest/dist/@flopflip-react-redux.umd.min.js) as a CDN to the [dist](https://unpkg.com/@flopflip/react-redux@latest/dist) files.
