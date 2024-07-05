import { selectAdapterConfigurationStatus } from '@flopflip/react';
import type {
  TAdapterIdentifiers,
  TAdapterStatusChange,
  TAdaptersStatus,
} from '@flopflip/types';

import { STATE_SLICE } from '../../store/constants';
import type { TState } from '../../types';
import type { TUpdateStatusAction } from './types';

// Actions
export const UPDATE_STATUS = '@flopflip/status/update';

const initialState = {};

// Reducer
const reducer = (
  // biome-ignore lint/style/useDefaultParameterLast: <explanation>
  state: TAdaptersStatus = initialState,
  action: TUpdateStatusAction
): TAdaptersStatus => {
  switch (action.type) {
    case UPDATE_STATUS:
      if (action.payload.id) {
        return {
          ...state,
          [action.payload.id]: {
            ...state?.[action.payload.id],
            ...action.payload.status,
          },
        };
      }

      return {
        ...state,
        ...Object.fromEntries(
          action.payload.adapterIdentifiers.map(
            (adapterInterfaceIdentifier) => [
              adapterInterfaceIdentifier,
              {
                ...state?.[adapterInterfaceIdentifier],
                ...action.payload.status,
              },
            ]
          )
        ),
      };

    default:
      return state;
  }
};

export default reducer;

// Action Creators
export const updateStatus = (
  statusChange: TAdapterStatusChange,
  adapterIdentifiers: TAdapterIdentifiers[]
): TUpdateStatusAction => ({
  type: UPDATE_STATUS,
  payload: { ...statusChange, adapterIdentifiers },
});
// Selectors
type TSelectStatusArgs = {
  adapterIdentifiers?: TAdapterIdentifiers[];
};
export const selectStatus =
  ({ adapterIdentifiers }: TSelectStatusArgs = {}) =>
  (state: TState) => {
    const { status } = state[STATE_SLICE];

    return selectAdapterConfigurationStatus(status, adapterIdentifiers);
  };
