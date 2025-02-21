import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { FLOPFLIP_STATE_SLICE, createFlopflipReducer } from '../src/';

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
