import {
  TAdapterStatus,
  TAdapterStatusChange,
  TAdapterSubscriptionStatus,
} from '@flopflip/types';
import { TUpdateStatusAction } from './types';
import { TState } from '../../types';
import { STATE_SLICE } from '../../store/constants';

// Actions
export const UPDATE_STATUS = '@flopflip/status/update';

const initialState: TAdapterStatus = {
  isReady: false,
  subscriptionStatus: TAdapterSubscriptionStatus.Subscribed,
};

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
export const updateStatus = (
  status: TAdapterStatusChange
): TUpdateStatusAction => ({
  type: UPDATE_STATUS,
  payload: { status },
});
// Selectors
export const selectStatus = (state: TState) => state[STATE_SLICE].status ?? {};
