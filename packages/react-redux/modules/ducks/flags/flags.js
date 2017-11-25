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
export const selectFlag = state => flagName => {
  const allFlags = selectFlags(state);

  return allFlags ? allFlags[flagName] : undefined;
};
