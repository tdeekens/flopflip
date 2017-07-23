<p align="center">
  <b style="font-size: 25px">🎛 flopflip - Feature Toggling 🎚</b><br />
  <i>flip or flop a feature in LaunchDarkly with real-time updates through a redux store.</i>
</p>

<p align="center">
  <img alt="Logo" src="https://raw.githubusercontent.com/tdeekens/flopflip/master/logo.png" /><br /><br />
  <i>Toggle features in LaunchDarkly with their state being maintained in a redux state slice being accessible through a set of Higher-Order Components in React (via recompose).</i><br />
</p>

<details>
  <summary>Want to see a demo?</summary>

  <img alt="Logo" src="https://raw.githubusercontent.com/tdeekens/flopflip/master/demo.gif" />
</details>

### Status

[![Travis](https://img.shields.io/travis/tdeekens/flopflip.svg?style=flat-square)]() 💎 [![npm](https://img.shields.io/tdeekens/v/flopflip.svg?style=flat-square)]() 💎  [![David](https://img.shields.io/david/tdeekens/flopflip.svg?style=flat-square)]()

## Installation

`yarn add flopflip` or `npm i flopflip --save`

## Documentation

Flopflip allows you to manage feature flags through [LaunchDarkly](https://launchdarkly.com/) within an application written using React and Redux.

### API & exports

The `modules/index.js` exports:

- `createFlopFlipEnhancer` a redux store enhancer to add feature toggle state to your redux store
- `reducer` and `STATE_SLICE` a reducer and the state slice for the feature toggle state
- `withFeatureToggle` a Higher-Order Component (HoC) to conditionally render components depending on feature toggle state
- `injectFeatureToggles` a Higher-Order Component (HoC) to inject requested feature toggles from existing feature toggles onto the `props` of a component
- `FeatureToggled` a component to conditionally render its `children` based on the status of a passed feature flag

#### `createFlopFlipEnhancer`

Requires arguments of `clientSideId:string`, `user:object`.

- The `clientSideId` is your LaunchDarkly ID.
- The `user` object needs at least a `key` attribute. An anonymous `key` will be generated using `uuid4` when nothing is specified. The user object can contain additional data.

#### `reducer` & `STATE_SLICE`

The reducer should be hooked into the `combineReducers` within your application in coordination with the `STATE_SLICE` which is used internally too to manage the location of the feature toggle states.

In context this configuration could look like:

```js
import { createStore, compose, applyMiddleware } from 'redux';
import {
  createFlopFlipEnhancer,
  reducer as featureToggleReducer,

  // We refer to this state slice in the `injectFeatureToggles`
  // HoC and currently do not support a custom state slice.
  STATE_SLICE as FEATURE_TOGGLE_STATE_SLICE
} from 'flopflip';

// Maintained somewhere within your application
import user from './user';
import appReducer from './reducer';

const store = createStore(
  combineReducers({
    appReducer,
    [FEATURE_TOGGLE_STATE_SLICE]: featureToggleReducer,
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

#### `FeatureToggled`

The component renders its `children` depending on the state of a given feature flag. It also allows passing an optional `untoggledComponent` which will be rendered whenever the feature is disabled instead of `null`.

```js
import React, { Component } from 'react';

import { FeatureToggled } from 'flopflip';
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

#### `withFeatureToggle`

The HoC to conditionally render a component based on a feature toggle's state. It accepts the feature toggle name and a an optional component to be rendered in case the feature is disabled.

Without a component rendered in place of the `ComponentToToggled`:

```js
import { withFeatureToggle } from 'flopflip';
import flagsNames from './feature-flags';

const ComponentToToggled = () => <h3>I might be gone or there!</h3>;

export default withFeatureToggle(flagsNames.THE_FEATURE_TOGGLE)(
  ComponentToToggled
);
```

With a component rendered in place of the `ComponentToToggled`:

```js
import { withFeatureToggle } from 'flopflip';
import flagsNames from './feature-flags';

const ComponentToToggled = () => <h3>I might be gone or there!</h3>;
const ComponentToBeRenderedInstead = () =>
  <h3>At least there is a fallback!</h3>;

export default withFeatureToggle(flagsNames.THE_FEATURE_TOGGLE)(
  ComponentToToggled,
  ComponentToBeRenderedInstead
);
```

#### `injectFeatureToggles`

This HoC matches feature toggles given against configured ones and injects the matching result. `withFeatureToggle` uses this to conditionally render a component.

```js
import { injectFeatureToggles } from 'flopflip';
import flagsNames from './feature-flags';

const Component = props => {
  if (props.featureToggles[flagsNames.TOGGLE_A])
    return <h3>Something to render!</h3>;
  else if (props.featureToggles[flagsNames.TOGGLE_B])
    return <h3>Something else render!</h3>;

  return <h3>Something different render!</h3>;
};

export default injectFeatureToggles([flagsNames.TOGGLE_A, flagsNames.TOGGLE_B])(
  Component
);
```

The feature flags will be available as `props` within the component allowing some custom decisions based on their value. This also applies a `React.Component` within which you might want to control custom behavior based on a toggle's value.

### Module formats

`Flopflip` is built as a UMD module using [`webpack`](https://github.com/tdeekens/flopflip/blob/master/webpack-config/umd.js). The distribution version is not added to `git` but created as a `preversion` [script](https://github.com/tdeekens/flopflip/blob/master/package.json).

- ...ESM just import the `modules/index.js` within your app.
- ...CommonJS use the `dist/flopflip.js`
- ...AMD use the `dist/flopflip.js`
- ...`<script />` link it to `dist/flopflip.js` or `dist/flopflip.min.js`

All build files are part of the npm distribution using the [`files`](https://github.com/tdeekens/flopflip/blob/master/package.json) array to keep install time short.

Also feel free to use [unpkg.com](https://unpkg.com/flopflip@latest/dist/umd/flopflip.js) as a CDN to the [dist](https://unpkg.com/flopflip@latest/dist/umd/) files.
