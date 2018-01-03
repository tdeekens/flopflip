// @flow

import type { AdapterStatus } from '@flopflip/types';
import type { State } from '../../types';
import type { Action, UpdateStatusAction } from '../../types.js';

// Actions
export const UPDATE_STATUS: string = '@flopflip/status/update';

const initialState: State = { isReady: false };

// Reducer
export default function reducer(
  state: State = initialState,
  action: Action = {}
): State {
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
export const updateStatus = (status: AdapterStatus): UpdateStatusAction => ({
  type: UPDATE_STATUS,
  payload: status,
});
