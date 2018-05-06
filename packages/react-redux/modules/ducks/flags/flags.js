// @flow

import type { FlagName, FlagVariation, Flag, Flags } from '@flopflip/types';
import type { State } from '../../types';
import type { Action, UpdateFlagsAction } from './types.js';

import isNil from 'lodash.isnil';
import { STATE_SLICE } from '../../store';

// Actions
export const UPDATE_FLAGS: string = '@flopflip/flags/update';

const initialState: State = {};

// Reducer
const reducer = (state: State = initialState, action: Action = {}): State => {
  switch (action.type) {
    case UPDATE_FLAGS:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
};
export default reducer;

export const createReducer = (initialState: Flags = initialState) => (
  state: State = initialState,
  action: Action = {}
) => reducer(state, action);

// Action Creators
export const updateFlags = (flags: Flags): UpdateFlagsAction => ({
  type: UPDATE_FLAGS,
  payload: flags,
});

// Selectors
export const selectFlags = (state: State): Flags => state[STATE_SLICE].flags;
export const selectFlag = (flagName: FlagName) => (state: State): Flag => {
  const allFlags: Flags = selectFlags(state);
  const flagValue: FlagVariation = allFlags[flagName];

  return isNil(flagValue) ? false : flagValue;
};
