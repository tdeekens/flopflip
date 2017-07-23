// Actions
export const UPDATE_STATUS = '@flopflip/UPDATE_STATUS';
export const UPDATE_FLAGS = '@flopflip/UPDATE_FLAGS';

export const STATE_SLICE = '@flopflip/FEATURE_TOGGLES';

const initialState = { flags: {}, isReady: false };

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_STATUS:
      return {
        ...state,
        isReady: action.payload.isReady,
      };

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
export const updateStatus = status => ({
  type: UPDATE_STATUS,
  payload: status,
});

export const updateFlags = flags => ({
  type: UPDATE_FLAGS,
  payload: flags,
});
