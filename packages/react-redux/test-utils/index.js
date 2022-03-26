import { combineReducers, createStore as createReduxStore } from 'redux';
import { createFlopflipReducer, FLOPFLIP_STATE_SLICE } from '../src/';

const defaultInitialState = {};

const reducer = combineReducers({
  [FLOPFLIP_STATE_SLICE]: createFlopflipReducer(),
});
const createStore = (initialState = defaultInitialState) =>
  createReduxStore(reducer, initialState);

export { createStore };
