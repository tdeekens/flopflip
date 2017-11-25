import { combineReducers } from 'redux';
import { flagsReducer } from './flags';
import { statusReducer } from './status';

export { updateStatus, UPDATE_STATUS } from './status';
export { updateFlags, UPDATE_FLAGS, selectFlag, selectFlags } from './flags';

export const flopflipReducer = combineReducers({
  flags: flagsReducer,
  status: statusReducer,
});
