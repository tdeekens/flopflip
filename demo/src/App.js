import React, { Component } from 'react';
import flowRight from 'lodash.flowright';
import { Provider, connect } from 'react-redux';
import classNames from 'classnames';
// Import adapter from '@flopflip/launchdarkly-adapter';
// import adapter, { updateFlags } from '@flopflip/memory-adapter';
import adapter, { updateFlags } from '@flopflip/memory-adapter';
import {
  ConfigureFlopFlip,
  branchOnFeatureToggle,
  injectFeatureToggle,
  ToggleFeature,
} from '@flopflip/react-broadcast';
// Change to `from '@flopflip/react-broadcast'` and everything will just work wtihout redux
import {
  increment,
  incrementAsync,
  decrement,
  decrementAsync,
} from './modules/counter';
import logo from './logo.svg';
import store from './store';
import './App.css';
import allFlags, {
  INCREMENT_ASYNC_BUTTON,
  DECREMENT_ASYNC_BUTTON,
  INCREMENT_SYNC_BUTTON,
} from './flags';

const UntoggledFeature = () => <h6>Disabled Feature</h6>;

const IncrementAsyncButton = (props) => (
  <button
    type="button"
    disabled={props.isIncrementing}
    onClick={props.incrementAsync}
  >
    Increment Async
  </button>
);
const FeatureToggledIncrementAsyncButton = flowRight(
  branchOnFeatureToggle({ flag: INCREMENT_ASYNC_BUTTON }, UntoggledFeature)
)(IncrementAsyncButton);

const IncrementSyncButton = (props) => (
  <button
    type="button"
    className={classNames({
      'incrementSyncButton--disabled': props.syncButtonStyle === false,
      'incrementSyncButton--yellow': props.syncButtonStyle === 'yellow',
      'incrementSyncButton--blue': props.syncButtonStyle === 'blue',
      'incrementSyncButton--purple': props.syncButtonStyle === 'purple',
    })}
    disabled={props.isIncrementing}
    onClick={props.increment}
  >
    Increment
  </button>
);

const FeatureToggledIncrementSyncButton = injectFeatureToggle(
  INCREMENT_SYNC_BUTTON,
  'syncButtonStyle'
)(IncrementSyncButton);

const Counter = (props) => (
  <div>
    <h1>Count around</h1>
    <p>Count: {props.count}</p>

    <div>
      <FeatureToggledIncrementSyncButton
        increment={props.increment}
        disabled={props.isIncrementing}
      />
      <br />
      <FeatureToggledIncrementAsyncButton
        incrementAsync={props.incrementAsync}
        isIncrementing={props.isIncrementing}
      />
    </div>

    <div>
      <button
        type="button"
        disabled={props.isDecrementing}
        onClick={props.decrement}
      >
        Decrementing
      </button>
      <br />
      <ToggleFeature
        flag={DECREMENT_ASYNC_BUTTON}
        untoggledComponent={UntoggledFeature}
      >
        <button
          type="button"
          disabled={props.isDecrementing}
          onClick={props.decrementAsync}
        >
          Decrement Async
        </button>
      </ToggleFeature>
    </div>
  </div>
);

const mapStateToProps = (state) => ({
  count: state.counter.count,
  isIncrementing: state.counter.isIncrementing,
  isDecrementing: state.counter.isDecrementing,
});

const mapDispatchToProps = {
  increment,
  incrementAsync,
  decrement,
  decrementAsync,
};

const ConnectedCounter = connect(mapStateToProps, mapDispatchToProps)(Counter);

class App extends Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return (
      <Provider store={store}>
        <ConfigureFlopFlip adapter={adapter} defaultFlags={allFlags}>
          <div className="App">
            <div className="App-header">
              <img src={logo} className="App-logo" alt="logo" />
              <h2>Welcome to flopflip</h2>
            </div>

            <ConnectedCounter />
          </div>
        </ConfigureFlopFlip>
      </Provider>
    );
  }
}

window.updateFlags = updateFlags;

export default App;
