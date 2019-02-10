import { Reducer } from 'redux';
import { combineReducers } from 'redux';
import { Flags } from '@flopflip/types';
import { UpdateFlagsAction } from './flags/types';
import { UpdateStatusAction } from './status/types';
import { flagsReducer, createFlagsReducer } from './flags';
import { statusReducer } from './status';

type Actions = UpdateFlagsAction & UpdateStatusAction;

export { updateStatus, UPDATE_STATUS } from './status';
export { updateFlags, UPDATE_FLAGS, selectFlag, selectFlags } from './flags';

export const flopflipReducer = combineReducers<any, Actions>({
  flags: flagsReducer,
  status: statusReducer,
});
export const createFlopflipReducer = (
  preloadedState: Flags = {}
): Reducer<any, Actions> =>
  combineReducers<any, Actions>({
    flags: createFlagsReducer(preloadedState),
    status: statusReducer,
  });
