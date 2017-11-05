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
