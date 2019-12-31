import isNil from 'lodash/isNil';
import { FlagName, FlagVariation, Flags } from '@flopflip/types';
import { UpdateFlagsAction } from './types.js';
import { State } from '../../types';
import { STATE_SLICE } from '../../store/constants';
import { Reducer } from 'redux';

// Actions
export const UPDATE_FLAGS = '@flopflip/flags/update';

const initialState: Flags = {};

// Reducer
const reducer = (
  state: Flags = initialState,
  action: UpdateFlagsAction
): Flags => {
  switch (action.type) {
    case UPDATE_FLAGS:
      return {
        ...state,
        ...action.payload.flags,
      };

    default:
      return state;
  }
};

export default reducer;

export const createReducer = (
  preloadedState: Flags = initialState
): Reducer<Flags, UpdateFlagsAction> => (state = preloadedState, action) =>
  reducer(state, action);

// Action Creators
export const updateFlags = (flags: Flags): UpdateFlagsAction => ({
  type: UPDATE_FLAGS,
  payload: { flags },
});

// Selectors
export const selectFlags = (state: State): Flags =>
  state[STATE_SLICE].flags ?? {};
export const selectFlag = (
  flagName: FlagName
): ((state: State) => FlagVariation) => state => {
  const allFlags: Flags = selectFlags(state);
  const flagValue: FlagVariation = allFlags[flagName];

  return isNil(flagValue) ? false : flagValue;
};
