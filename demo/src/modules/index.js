import { combineReducers } from 'redux';
import {
  reducer as featureToggleReducer,
  STATE_SLICE as FEATURE_TOGGLE_STATE_SLICE,
} from 'flopflip';
import counter from './counter';

export default combineReducers({
  [FEATURE_TOGGLE_STATE_SLICE]: featureToggleReducer,
  counter,
});
