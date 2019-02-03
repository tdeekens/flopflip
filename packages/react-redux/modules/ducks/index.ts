// @flow

import { FlagName, FlagVariation, Flag, Flags } from '@flopflip/types';

import { combineReducers } from 'redux';
import { flagsReducer, createFlagsReducer } from './flags';
import { statusReducer } from './status';

export { updateStatus, UPDATE_STATUS } from './status';
export { updateFlags, UPDATE_FLAGS, selectFlag, selectFlags } from './flags';

export const flopflipReducer = combineReducers({
  flags: flagsReducer,
  status: statusReducer,
});
export const createFlopflipReducer = (preloadedState: Flags = {}) =>
  combineReducers({
    flags: createFlagsReducer(preloadedState),
    status: statusReducer,
  });
