import { FlagName, FlagVariation, Flags } from '@flopflip/types';
import { State } from '../../types';
import { UpdateFlagsAction } from './types.js';

import isNil from 'lodash.isnil';
import { STATE_SLICE } from '../../store';
import { Reducer } from 'redux';

// Actions
export const UPDATE_FLAGS = '@flopflip/flags/update';

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

export const createReducer = (
  preloadedState: State = initialState
): Reducer<State, UpdateFlagsAction> => (state = preloadedState, action) =>
  reducer(state, action);

// Action Creators
export const updateFlags = (flags: Flags): UpdateFlagsAction => ({
  type: UPDATE_FLAGS,
  payload: { flags },
});

// Selectors
export const selectFlags = (state: State): Flags => state[STATE_SLICE].flags;
export const selectFlag = (
  flagName: FlagName
): ((state: Flags) => FlagVariation) => state => {
  const allFlags: Flags = selectFlags(state);
  const flagValue: FlagVariation = allFlags[flagName];

  return isNil(flagValue) ? false : flagValue;
};
