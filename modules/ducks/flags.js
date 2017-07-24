// Actions
export const UPDATE_FLAGS = '@flopflip/flags/update';

const initialState = { flags: {} };

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_FLAGS:
      return {
        ...state,
        flags: {
          ...state.flags,
          ...action.payload,
        },
      };

    default:
      return state;
  }
}

// Action Creators
export const update = flags => ({
  type: UPDATE_FLAGS,
  payload: flags,
});
