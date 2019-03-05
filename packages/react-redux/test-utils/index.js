import { createStore as createReduxStore } from 'redux';
import { combineReducers } from 'redux';
import {
  createFlopflipReducer,
  FLOPFLIP_STATE_SLICE,
} from '@flopflip/react-redux';

const defaultInitialState = {};

const reducer = combineReducers({
  [FLOPFLIP_STATE_SLICE]: createFlopflipReducer(),
});
const createStore = (initialState = defaultInitialState) =>
  createReduxStore(reducer, initialState);

export { createStore };
