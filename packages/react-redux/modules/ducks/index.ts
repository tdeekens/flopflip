import { Reducer } from 'redux';
import { combineReducers } from 'redux';
import { TFlags } from '@flopflip/types';
import { TUpdateFlagsAction } from './flags/types';
import { TUpdateStatusAction } from './status/types';
import { flagsReducer, createFlagsReducer } from './flags';
import { statusReducer } from './status';

type Actions = TUpdateFlagsAction & TUpdateStatusAction;

export { updateStatus, UPDATE_STATUS } from './status';
export { updateFlags, UPDATE_FLAGS, selectFlag, selectFlags } from './flags';

export const flopflipReducer = combineReducers<any, Actions>({
  flags: flagsReducer,
  status: statusReducer,
});
export const createFlopflipReducer = (
  preloadedState: TFlags = {}
): Reducer<any, Actions> =>
  combineReducers<any, Actions>({
    flags: createFlagsReducer(preloadedState),
    status: statusReducer,
  });
