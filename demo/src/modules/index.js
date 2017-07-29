import { combineReducers } from 'redux';
import { flopflipReducer, FLOPFLIP_STATE_SLICE } from '@flopflip/react-redux';
import counter from './counter';

export default combineReducers({
  [FLOPFLIP_STATE_SLICE]: flopflipReducer,
  counter,
});
