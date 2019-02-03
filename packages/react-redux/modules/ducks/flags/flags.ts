import { FlagName, FlagVariation, Flags } from '@flopflip/types';
import { State } from '../../types';
import { UpdateFlagsAction } from './types.js';

import isNil from 'lodash.isnil';
import { STATE_SLICE } from '../../store';

// Actions
export const UPDATE_FLAGS: string = '@flopflip/flags/update';

const initialState: State = {};

// Reducer
const reducer = (
  state: State = initialState,
  action: UpdateFlagsAction
): State => {
  switch (action.type) {
    case UPDATE_FLAGS:
      return {
        ...state,
        flags: action.payload.flags,
      };

    default:
      return state;
  }
};
export default reducer;

export const createReducer = (preloadedState: State = initialState) => (
  state: State = preloadedState,
  action: UpdateFlagsAction
) => reducer(state, action);

// Action Creators
export const updateFlags = (flags: Flags): UpdateFlagsAction => ({
  type: UPDATE_FLAGS,
  payload: { flags },
});

// Selectors
export const selectFlags = (state: State): Flags => state[STATE_SLICE].flags;
export const selectFlag = (flagName: FlagName) => (
  state: State
): FlagVariation => {
  const allFlags: Flags = selectFlags(state);
  const flagValue: FlagVariation = allFlags[flagName];

  return isNil(flagValue) ? false : flagValue;
};
