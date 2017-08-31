import React, { Component } from 'react';
import { compose } from 'recompose';
import { Provider, connect } from 'react-redux';
import classNames from 'classnames';
import {
  ConfigureFlopFlip,
  withFeatureToggle,
  injectFeatureToggle,
  FeatureToggled,
} from '@flopflip/react-redux';
// change to `from '@flopflip/react-broadcast'` and everything will just work wtihout redux
import {
  increment,
  incrementAsync,
  decrement,
  decrementAsync,
} from './modules/counter';
import logo from './logo.svg';
import store from './store';
import './App.css';
import * as flags from './flags';

const UntoggledFeature = <h6>Disabled Feature</h6>;

const IncrementAsyncButton = props => (
  <button onClick={props.incrementAsync} disabled={props.isIncrementing}>
    Increment Async
  </button>
);
const FeatureToggledIncrementAsyncButton = compose(
  withFeatureToggle(flags.INCREMENT_ASYNC_BUTTON, () => UntoggledFeature)
)(IncrementAsyncButton);

const IncrementSyncButton = props => (
  <button
    className={classNames({
      'incrementSyncButton--disabled': props.syncButtonStyle === false,
      'incrementSyncButton--yellow': props.syncButtonStyle === 'yellow',
      'incrementSyncButton--blue': props.syncButtonStyle === 'blue',
      'incrementSyncButton--purple': props.syncButtonStyle === 'purple',
    })}
    onClick={props.increment}
    disabled={props.isIncrementing}
  >
    Increment
  </button>
);
const FeatureToggledIncrementSyncButton = injectFeatureToggle(
  flags.INCREMENT_SYNC_BUTTON,
  'syncButtonStyle'
)(IncrementSyncButton);

const Counter = props => (
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
      <button onClick={props.decrement} disabled={props.isDecrementing}>
        Decrementing
      </button>
      <br />
      <FeatureToggled
        flag={flags.DECREMENT_ASYNC_BUTTON}
        untoggledComponent={<h6>Disabled Feature</h6>}
      >
        <button onClick={props.decrementAsync} disabled={props.isDecrementing}>
          Decrement Async
        </button>
      </FeatureToggled>
    </div>
  </div>
);

const mapStateToProps = state => ({
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

const defaultFlags = { 'aDefault-Flag': true };
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConfigureFlopFlip
          clientSideId="596788417a20200c2b70c89e"
          user={{ key: 'ld-2@tdeekens.name' }}
          defaultFlags={defaultFlags}
          shouldChangeUserContext={true}
        >
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

export default App;
