import type { TFlagsContext } from '@flopflip/types';
import { combineReducers } from 'redux';

import {
  createReducer as createFlagsReducer,
  reducer as flagsReducer,
} from './flags';
import { reducer as statusReducer } from './status';
import type { TUpdateFlagsAction, TUpdateStatusAction } from './types';

type Actions = TUpdateFlagsAction & TUpdateStatusAction;

export { selectFlag, selectFlags, UPDATE_FLAGS, updateFlags } from './flags';
export { UPDATE_STATUS, updateStatus } from './status';

export const flopflipReducer = combineReducers<any, Actions>({
  flags: flagsReducer,
  status: statusReducer,
});
export const createFlopflipReducer = (
  preloadedState: TFlagsContext = { memory: {} }
) =>
  combineReducers<any, Actions>({
    flags: createFlagsReducer(preloadedState),
    status: statusReducer,
  });
