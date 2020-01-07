import { AdapterStatus } from '@flopflip/types';
import { State } from '../../types';
import { STATE_SLICE } from '../../store/constants';
import { UpdateStatusAction } from './types';

// Actions
export const UPDATE_STATUS = '@flopflip/status/update';

const initialState: AdapterStatus = { isReady: false };

// Reducer
const reducer = (
  state: AdapterStatus = initialState,
  action: UpdateStatusAction
): AdapterStatus => {
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
export const updateStatus = (status: AdapterStatus): UpdateStatusAction => ({
  type: UPDATE_STATUS,
  payload: { status },
});
// Selectors
export const selectStatus = (state: State): AdapterStatus =>
  state[STATE_SLICE].status ?? {};
