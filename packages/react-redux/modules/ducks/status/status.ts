import { AdapterStatus } from '@flopflip/types';
import { State } from '../../types';
import { UpdateStatusAction } from './types';

// Actions
export const UPDATE_STATUS = '@flopflip/status/update';

const initialState: State = { status: { isReady: false } };

// Reducer
const reducer = (
  state: State = initialState,
  action: UpdateStatusAction
): State | AdapterStatus => {
  switch (action.type) {
    case UPDATE_STATUS:
      return {
        ...state.status,
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
