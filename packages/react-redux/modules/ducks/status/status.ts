import { TAdapterStatus } from '@flopflip/types';
import { TUpdateStatusAction } from './types';
import { TState } from '../../types';
import { STATE_SLICE } from '../../store/constants';

// Actions
export const UPDATE_STATUS = '@flopflip/status/update';

const initialState: TAdapterStatus = { isReady: false };

// Reducer
const reducer = (
  state: TAdapterStatus = initialState,
  action: TUpdateStatusAction
): TAdapterStatus => {
  switch (action.type) {
    case UPDATE_STATUS:
      return {
        ...state,
        ...action.payload.status,
      };

    default:
      return state;
  }
};

export default reducer;

// Action Creators
export const updateStatus = (status: TAdapterStatus): TUpdateStatusAction => ({
  type: UPDATE_STATUS,
  payload: { status },
});
// Selectors
export const selectStatus = (state: TState) => state[STATE_SLICE].status ?? {};
