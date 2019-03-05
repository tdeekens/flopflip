import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
// Import adapter from '@flopflip/localstorage-adapter';
// import { createFlopFlipEnhancer } from '@flopflip/react-redux';
import rootReducer from './modules';

/* Const defaultFlags = { 'aDefault-Flag': true };
const adapterArgs = {
  clientSideId: '596788417a20200c2b70c89e',
  user: { key: 'ld-2@tdeekens.name' },
}; */

const initialState = {};
const enhancers = [
  // NOTE: Comment in the line below to add the store enhancer.
  // createFlopFlipEnhancer(adapter, adapterArgs)
];
const middleware = [thunk, logger];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.devToolsExtension;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

const store = createStore(rootReducer, initialState, composedEnhancers);

export default store;
