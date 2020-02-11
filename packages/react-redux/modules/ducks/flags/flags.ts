import { TFlagName, TFlagVariation, TFlags } from '@flopflip/types';
import { isNil } from '@flopflip/react';
import { TUpdateFlagsAction } from './types.js';
import { TState } from '../../types';
import { STATE_SLICE } from '../../store/constants';
import { Reducer } from 'redux';

// Actions
export const UPDATE_FLAGS = '@flopflip/flags/update';

const initialState: TFlags = {};

// Reducer
const reducer = (
  state: TFlags = initialState,
  action: TUpdateFlagsAction
): TFlags => {
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
  preloadedState: TFlags = initialState
): Reducer<TFlags, TUpdateFlagsAction> => (state = preloadedState, action) =>
  reducer(state, action);

// Action Creators
export const updateFlags = (flags: TFlags): TUpdateFlagsAction => ({
  type: UPDATE_FLAGS,
  payload: { flags },
});

// Selectors
export const selectFlags = (state: TState) => state[STATE_SLICE].flags ?? {};
export const selectFlag = (
  flagName: TFlagName
): ((state: TState) => TFlagVariation) => state => {
  const allFlags: TFlags = selectFlags(state);
  const flagValue: TFlagVariation = allFlags[flagName];

  return isNil(flagValue) ? false : flagValue;
};
