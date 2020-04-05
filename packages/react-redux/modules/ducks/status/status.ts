import { DeepReadonly } from 'ts-essentials';
import {
  TAdapterStatus,
  TAdapterStatusChange,
  TAdapterSubscriptionStatus,
  TAdapterConfigurationStatus,
} from '@flopflip/types';
import { selectAdapterConfigurationStatus } from '@flopflip/react';
import { TUpdateStatusAction } from './types';
import { TState } from '../../types';
import { STATE_SLICE } from '../../store/constants';

// Actions
export const UPDATE_STATUS = '@flopflip/status/update';

const initialState: TAdapterStatus = {
  subscriptionStatus: TAdapterSubscriptionStatus.Subscribed,
  configurationStatus: TAdapterConfigurationStatus.Unconfigured,
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

  return selectAdapterConfigurationStatus(status?.configurationStatus);
};
