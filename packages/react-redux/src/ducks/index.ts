import { TFlagsContext } from '@flopflip/types';
import { combineReducers } from 'redux';

import { createFlagsReducer, flagsReducer } from './flags';
import { TUpdateFlagsAction } from './flags/types';
import { statusReducer } from './status';
import { TUpdateStatusAction } from './status/types';

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
