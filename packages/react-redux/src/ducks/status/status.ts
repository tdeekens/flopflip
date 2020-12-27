import type { TAdapterStatus, TAdapterStatusChange } from '@flopflip/types';
import {
  AdapterSubscriptionStatus,
  AdapterConfigurationStatus,
} from '@flopflip/types';

import { selectAdapterConfigurationStatus } from '@flopflip/react';
import { TUpdateStatusAction } from './types';
import { TState } from '../../types';
import { STATE_SLICE } from '../../store/constants';

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
