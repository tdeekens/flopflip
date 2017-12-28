// @flow

import type {
  State,
  FlagName,
  FlagVariation,
  Flag,
  Flags,
} from '../../types.js';
import type { Action, UpdateFlagsAction } from './types.js';

import isNil from 'lodash.isnil';
import { STATE_SLICE } from '../../store';

// Actions
export const UPDATE_FLAGS: string = '@flopflip/flags/update';

const initialState: State = {};

// Reducer
export default function reducer(
  state: State = initialState,
  action: Action = {}
) {
  switch (action.type) {
    case UPDATE_FLAGS:
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

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
