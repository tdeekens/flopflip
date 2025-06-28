import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { createFlopflipReducer, FLOPFLIP_STATE_SLICE } from '../src/';

const defaultInitialState = {};

const reducer = combineReducers({
  [FLOPFLIP_STATE_SLICE]: createFlopflipReducer(),
});
const createStore = (initialState = defaultInitialState) =>
  configureStore({
    reducer,
    preloadedState: initialState,
  });

export { createStore };
