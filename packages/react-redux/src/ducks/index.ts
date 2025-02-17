import type { TFlagsContext } from '@flopflip/types';
import { combineReducers } from 'redux';

import {
  createReducer as createFlagsReducer,
  reducer as flagsReducer,
} from './flags';
import { reducer as statusReducer } from './status';

export { selectFlag, selectFlags, UPDATE_FLAGS, updateFlags } from './flags';
export { UPDATE_STATUS, updateStatus } from './status';

export const flopflipReducer = combineReducers({
  flags: flagsReducer,
  status: statusReducer,
});
export const createFlopflipReducer = (
  preloadedState: TFlagsContext = { memory: {} }
) =>
  combineReducers({
    flags: createFlagsReducer(preloadedState),
    status: statusReducer,
  });
