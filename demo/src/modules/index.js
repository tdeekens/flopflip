import {
  createFlopflipReducer,
  FLOPFLIP_STATE_SLICE,
} from '@flopflip/react-redux';
import { combineReducers } from 'redux';

import counter from './counter';

export default combineReducers({
  [FLOPFLIP_STATE_SLICE]: createFlopflipReducer(),
  counter,
});
