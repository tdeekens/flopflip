import type { DeepReadonly } from 'ts-essentials';
import type { TAdapterStatus, TAdapterStatusChange } from '@flopflip/types';
import {
  AdapterSubscriptionStatus,
  AdapterConfigurationStatus,
} from '@flopflip/types';

import { selecAdapterConfigurationStatus } from '@flopflip/react';
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
  state: Readonly<TAdapterStatus> = initialState,
  action: DeepReadonly<TUpdateStatusAction>
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
  nextStatus: Readonly<TAdapterStatusChange>
): TUpdateStatusAction => ({
  type: UPDATE_STATUS,
  payload: { status: nextStatus },
});
// Selectors
export const selectStatus = (state: DeepReadonly<TState>) => {
  const { status } = state[STATE_SLICE];

  return selecAdapterConfigurationStatus(status?.configurationStatus);
};
