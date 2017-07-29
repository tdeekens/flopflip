// Actions
export const UPDATE_STATUS = '@flopflip/status/update';

const initialState = { isReady: false };

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_STATUS:
      return {
        ...state,
        isReady: action.payload.isReady,
      };

    default:
      return state;
  }
}

// Action Creators
export const update = status => ({
  type: UPDATE_STATUS,
  payload: status,
});
