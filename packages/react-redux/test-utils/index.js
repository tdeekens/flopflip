import { combineReducers, createStore as createReduxStore } from 'redux';

import { FLOPFLIP_STATE_SLICE, createFlopflipReducer } from '../src/';

const defaultInitialState = {};

const reducer = combineReducers({
  [FLOPFLIP_STATE_SLICE]: createFlopflipReducer(),
});
const createStore = (initialState = defaultInitialState) =>
  createReduxStore(reducer, initialState);

export { createStore };
