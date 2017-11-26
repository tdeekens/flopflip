import isNil from 'lodash.isnil';
import { STATE_SLICE } from '../../store';

// Actions
export const UPDATE_FLAGS = '@flopflip/flags/update';

const initialState = {};

// Reducer
export default function reducer(state = initialState, action = {}) {
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
export const updateFlags = flags => ({
  type: UPDATE_FLAGS,
  payload: flags,
});

// Selectors
export const selectFlags = state => state[STATE_SLICE].flags;
export const selectFlag = flagName => state => {
  const allFlags = selectFlags(state);
  const flagValue = allFlags[flagName];

  return isNil(flagValue) ? false : flagValue;
};
