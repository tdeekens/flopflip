import { selectAdapterConfigurationStatus } from '@flopflip/react';
import {
  type TAdapterStatus,
  type TAdapterStatusChange,
  AdapterConfigurationStatus,
  AdapterSubscriptionStatus,
} from '@flopflip/types';

import { STATE_SLICE } from '../../store/constants';
import { TState } from '../../types';
import { TUpdateStatusAction } from './types';

// Actions
export const UPDATE_STATUS = '@flopflip/status/update';

const initialState: TAdapterStatus = {
  subscriptionStatus: AdapterSubscriptionStatus.Subscribed,
  configurationStatus: AdapterConfigurationStatus.Unconfigured,
};

// Reducer
const reducer = (
  // eslint-disable-next-line @typescript-eslint/default-param-last
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
  statusChange: TAdapterStatusChange
): TUpdateStatusAction => ({
  type: UPDATE_STATUS,
  payload: statusChange,
});
// Selectors
export const selectStatus = (state: TState) => {
  const { status } = state[STATE_SLICE];

  return selectAdapterConfigurationStatus(status?.configurationStatus);
};
